<template>
  <div class="flex h-screen justify-center text-white items-center text-gray-50">
    <div class="m-auto">
      <h1 class="text-6xl pb-8">Gear</h1>
      

      <p class="px-4 md;px-0 md:max-w-lg mx-auto">Gear is randomized cyber gear generated and stored on chain. Stats, images, and other functionality are intentionally omitted for others to interpret.</p>
      <p class="py-4">Please feel free to use gear in any way you want.</p>

      <p class="pb-4 font-bold" v-if="!isAdmin">(COMING SOON..)</p>
      <p class="pb-4 font-bold" v-if="isAdmin&&isUserConnected ">Total Minted: {{getTotalSupply}} / 7777</p>
      <div class="mb-4" v-if="isUserConnected && isAdmin && notSoldOut">
        <button v-if="!hasMinted" class="px-2 py-2 border-white border-2 hover:cursor-pointer hover:bg-white hover:text-primary"  @click="mintRandomGear">
          Claim (1) Random Gear
        </button>
        <div v-else-if="isMinting" class="py2 animate-ping text-green-600">
          Minting your gear #{{itemNumber}}...
        </div>
        <div v-else class="py2">
          Thank for claiming your gear #{{itemNumber}}! click <span @click="resetMint" class="underline font-bold hover:text-blue-800 hover:cursor-pointer">HERE</span> in <b>{{throttleCounter}} seconds</b>  to claim again!
        </div>
      </div>
      <div class="mb-4">
        All Gear has been claimed, check out <a class="font-bold underline hover:text-blue-800 hover:cursor-pointer" target="_blank" href="https://opensea.io/collection/gear-for-punks">OpenSea</a> to get some second-hand Gear ⚙️
        <div class="mb-4 mt-2 mx-auto">
          
          <h1 class="font-bold py-2">Resources for Gear owners</h1>
          <ul class="">
            <li class="py-2"> <a target="_blank" class="font-bold underline text-green-600 hover:text-blue-800 hover:cursor-pointer" href="https://www.gearforpunks.app/">gearforpunks.app (Gear Rarity Waller Checker)</a></li>
            <li class="py-2"> <a target="_blank" class="font-bold underline hover:text-blue-800 hover:cursor-pointer" href="https://docs.google.com/spreadsheets/d/1FrV0dLD4LxphhjCJ8qJ3H9Q05wrEdoVvgfleVfHT00E/edit#gid=0">Gear Rarity Google Doc by Toomaie</a></li>
          </ul>
        </div>
      </div>
      
      <div v-if="isUserConnected">
        <p><strong>Connected to:</strong> {{getChainName}} </p>
        <button class="text-green-600 hover:text-red-500" href="#" v-if="isUserConnected" @click="disconnectWeb3Modal">Disconnect {{getActiveAccount.substring(0, 7)}}...</button>
      </div>
      <p v-else class="text-sm">
        (Please <button href="#" @click="connectWeb3Modal" class="underline text-blue-600 hover:text-blue-800 visited:text-purple-600">connect</button> with your MetaMask Ethereum wallet.)
      </p>
      <div class="inline-block py-4">
        <a class="font-bold underline hover:text-blue-800 hover:cursor-pointer" target="_blank" href="https://opensea.io/collection/gear-for-punks">OpenSea</a>
        <span> - </span>
        <a class="font-bold underline hover:text-blue-800 hover:cursor-pointer" target="_blank" href="https://discord.gg/SzGmVjjMbG">Discord</a>
        <span> - </span>
        <a class="font-bold underline hover:text-blue-800 hover:cursor-pointer" target="_blank" href="https://twitter.com/gearforpunks">@gearforpunks</a>
      </div>
      </div>
  </div>
</template>

<script>
import { ethers } from "ethers"
import { mapGetters, mapActions } from "vuex";

export default {
  name: "Home",
  computed: {
    ...mapGetters("accounts", ["getActiveAccount", "getChainName", "isUserConnected", "getWeb3Modal", "getTotalSupply", "getProviderEthers"]),
    ...mapGetters("contracts", ["getTotalSupply", "getGearAbi", "getGearAddress"]),
    showChainAlert() {
      switch (this.getChainName) {
        case "Mainnet":
          return false;
        default:
          return true;
      }
    },
    isAdmin() {
      return true
    },
    notSoldOut() {
      return this.getTotalSupply < 7776
    }
  },
  data() {
    return {
      isMinting: false,
      transactionPending: false,
      errorMsg: '',
      tokenContract: null,
      hasMinted: false,
      throttleCounter: 0,
      itemNumber: 0,
    }
  },
  async created() {
    this.$store.dispatch("contracts/storeGearAbi");
    await this.$store.dispatch("accounts/initWeb3Modal");
    await this.$store.dispatch("accounts/ethereumListener");
    this.$store.dispatch("contracts/storeGearAddress");
    await this.$store.dispatch("contracts/fetchGearSupply");
  },
  methods: {
    ...mapActions("accounts", ["connectWeb3Modal", "disconnectWeb3Modal"]),
    async mintRandomGear(){
      if (!this.isMinting) {
        this.isMinting = true
        this.transactionPending = true
        this._setUpWallet()
        await this._mintRandomGear()
        this.isMinting = false
        this.throttleCountdown()
      }
    },
    resetMint() {
      if (this.throttleCounter == 0) {
        this.hasMinted = false
      }
    },
    throttleCountdown() {
      this.throttleCounter = 10;
      var throttleTimer = setInterval(() => {
        if(this.throttleCounter <= 0){
          clearInterval(throttleTimer);
          this.throttleCounter = 0
        } else {
          this.throttleCounter -= 1;
        }
      }, 1000);
    },
    _setUpWallet() {
      let signer = this.getProviderEthers.getSigner();
      console.log(`Contract with address: ${this.getGearAddress}, ${this.getGearAbi}`)
      this.tokenContract = new ethers.Contract(this.getGearAddress, this.getGearAbi, signer);
      let component = this;

      // set event listener
      this.tokenContract.on("Transfer", (_from, to, tokenId) => {
        // show a toast
        if (to == component.getActiveAccount) {
          component.$toasted.show(`Your Gear #${tokenId} Had Been Tranferred to You!`, {
            type: 'success',
            duration: 5000,
            theme: "bubble",
            position: "top-center"
          });
          component.transactionPending = false
        }
      });
    },
    _randomNumber(min=1, max=7777) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min) + min);
    },
    async _mintRandomGear(){
      const randGearId = this._randomNumber()
      this.itemNumber = randGearId
      console.log(`GearID: ${randGearId}`)
      await this.tokenContract.claim(randGearId).then(()=>{
        this.hasMinted = true
      }).catch(rejected => {
        console.log(`Failed trans: ${rejected}`)
        if (rejected['code'] != 4001) {
          this.$toasted.show(`Stash #${this.itemNumber} Has already been claimed! Reload the page and try again... :)`, {
            type: 'error',
            duration: 5000,
            theme: "bubble",
            position: "top-center"
          });
        }
        this.hasMinted = false
        this.transactionPending = false
      })
      
    }
  }
}
</script>
