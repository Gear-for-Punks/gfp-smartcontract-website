<template>
  <div class="flex h-screen justify-center text-white items-center text-gray-50">
    <div class="m-auto">
      <h1 class="text-6xl pb-8">Gear</h1>
      
      <p class="pb-4 font-bold" v-if="gearImageURL">
          <img class="w-80 w-auto shadow-2xl" :src="gearImageURL" alt="">
      </p>
      <div v-if="isUserConnected">
        <p><strong>Connected to:</strong> {{getChainName}} </p>
        <button class="text-green-700 hover:text-red-500" href="#" v-if="isUserConnected" @click="disconnectWeb3Modal">Disconnect {{getActiveAccount.substring(0, 7)}}...</button>
      </div>
      <p v-else class="text-sm">
        (Please <button href="#" @click="connectWeb3Modal" class="underline text-blue-600 hover:text-blue-800 visited:text-purple-600">connect</button> with MetaMask
        or some other Ethereum wallet.)
      </p>
      <div class="inline-block py-4">
        <a class="font-bold underline hover:text-blue-800 hover:cursor-pointer" href="https://opensea.io/collection/gearforpunks">OpenSea</a>
        <span> - </span>
        <a class="font-bold underline hover:text-blue-800 hover:cursor-pointer" href="https://discord.gg/SzGmVjjMbG">Discord</a>
        <span> - </span>
        <a class="font-bold underline hover:text-blue-800 hover:cursor-pointer" href="https://twitter.com/gearforpunks">@gearforpunks</a>
      </div>
      </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "Stats",
  computed: {
    ...mapGetters("accounts", ["getActiveAccount", "getChainName", "isUserConnected", "getWeb3Modal", "getTotalSupply"]),
    ...mapGetters("contracts", ["getTotalSupply", "getBase64TokenURL"]),
    showChainAlert() {
      switch (this.getChainName) {
        case "Mainnet":
          return false;
        default:
          return true;
      }
    },
    isAdmin() {
      return this.$route.query['is_admin'] == 'punk'
    },
    gearQuery() {
      return this.$route.query['gear']
    },
    gearBlob(){
      return this.getBase64TokenURL ? JSON.parse(atob(this.getBase64TokenURL)) : ""
    },
    gearImageURL() {
      return this.gearBlob ? this.gearBlob["image"] : ""
    }
  },
  watch: {
        'gearQuery': {
            // immediate: true,
            handler(newVal) {
                console.log(newVal)
                if (newVal) {
                    this.fetchGearURL(newVal)
                }
            }
        }
  },
  async created() {
    this.$store.dispatch("contracts/storeGearAbi");
    await this.$store.dispatch("accounts/initWeb3Modal");
    await this.$store.dispatch("accounts/ethereumListener");
    this.$store.dispatch("contracts/storeGearAddress");
    await this.$store.dispatch("contracts/fetchGearSupply");
    if (this.gearQuery) {
         await this.$store.dispatch("contracts/fetchGearURL", this.gearQuery);
    }
  },
  methods: {
    ...mapActions("accounts", ["connectWeb3Modal", "disconnectWeb3Modal"]),
    ...mapActions("contracts", ["fetchGearURL"]),
  }
}
</script>
