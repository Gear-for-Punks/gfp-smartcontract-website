import { ethers } from "ethers";
import Gear from "../../contracts/Gear.json";
import addresses from "../../contracts/addresses.json";

const state = {
  totalSupply: 0,
  base64TokenURL: null,
  gearAbi: null,
  gearAddress: null,
};

const getters = {
  getTotalSupply(state) {
    return state.totalSupply;
  },
  getGearAbi(state) {
    return state.gearAbi;
  },
  getGearAddress(state) {
    return state.gearAddress;
  },
  getBase64TokenURL(state) {
    return state.base64TokenURL;
  }
};

const actions = {
  storeGearAbi({ commit }) {
    commit("setGearAbi", Gear.abi);
  },
  storeGearAddress({ commit, rootState }) {
    let chainIdDec = parseInt(rootState.accounts.chainId);
    let gearAddress = addresses.Gear[chainIdDec];

    commit("setGearAddress", gearAddress);
  },
  async fetchGearSupply({ commit, rootState }) {
    let provider = rootState.accounts.providerEthers;
    let chainIdDec = parseInt(rootState.accounts.chainId);
    let gearAddress = addresses.Gear[chainIdDec];
    console.log(`Gear Address: ${gearAddress}, ChainID: ${chainIdDec}, TokenID: ${chainIdDec}`)
    let contract = new ethers.Contract(gearAddress, Gear.abi, provider);

    let num = await contract.totalSupply();

    commit("setTotalSupply", num);
  },
  async fetchGearURL({ commit, rootState }, tokenId) {
    let provider = rootState.accounts.providerEthers;
    let chainIdDec = parseInt(rootState.accounts.chainId);
    let gearAddress = addresses.Gear[chainIdDec];
    console.log(`Gear Address: ${gearAddress}, ChainID: ${chainIdDec}, TokenID: ${chainIdDec}`)
    let contract = new ethers.Contract(gearAddress, Gear.abi, provider);

    tokenId = parseInt(tokenId)
    let base64TokenURL = await contract.tokenURI(tokenId);
    base64TokenURL = base64TokenURL.split(',')[1]
    console.log(base64TokenURL)
    commit("setBase64TokenURL", base64TokenURL);
  }
};

const mutations = {
  setTotalSupply(state, totalSupply) {
    state.totalSupply = totalSupply
  },
  setGearAbi(state, abi) {
    state.gearAbi = abi;
  },
  setGearAddress(state, address) {
    state.gearAddress = address;
  },
  setBase64TokenURL(state, base64TokenURL) {
    state.base64TokenURL = base64TokenURL
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
