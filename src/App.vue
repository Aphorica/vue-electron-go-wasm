<template>
  <div id="app">
    <h1><u>GoLang Processor in Electron</u></h1>
    <h3>Input Struct</h3>
    <div class="display-block" v-html="input" />
    <h3>OutputStruct</h3>
    <div class="display-block" v-html="output" />
    <div class="button-row">
      <button @click="onInitClicked"
              :disabled="!(btnState & INIT)">Init</button>
      <button @click="onRunClicked"
              :disabled="!(btnState & RUN)">Run</button>
      <button @click="onEndClicked"
              :disabled="!(btnState & END)">End</button>
    </div>
  </div>
</template>

<style lang="scss">
#app {
  font-family: Arial, Helvetica, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.display-block {border: thin solid black; width:80%;
                margin: 0 auto;
                min-height: 5em;
                padding:1em;
                text-align:left}
h3 {margin-top:3em;}
.button-row {margin-top:2em; display: flex; flex-direction: row;
              justify-content: center;}
button {font-size:1.2em; margin:0 1em; width:4em;
        border-radius: 0.5em;}

button:focus {outline:none!important}
</style>
<script>
const ipc = window.require('electron').ipcRenderer
import AphWebAssembly from './lib/AphWebAssembly'

const INIT = 1, RUN = 2, END = 4

export default {
  name: 'app',
  components: {
  },
  data: function() { return {
    inputData: {first: "George", last: "Wilson", score: 0},
    outputData: {},
    btnState: 0,
    wasmObj: null
  }},
  mounted() {
    this.btnState = INIT
  },
  methods: {
    onInitClicked() {
      let appPath = ipc.sendSync('fetch-app-path')
      this.btnState = RUN
      this.outputData = {status: "initialized (wasm created, function registered"}
      this.wasmObj = new AphWebAssembly(appPath + '/lib.wasm')
    },
    async onRunClicked() {
      let retStr
      this.btnState = 0
      retStr = await this.wasmObj.run(window.gofuncModObject,
                                      JSON.stringify(this.inputData))
      if (!retStr || retStr.length === 0)
        alert("onRunClicked: wasmObj call failed")
      
      else {
        let _this = this
        this.outputData = {status: "success",
                           data: JSON.parse(retStr)}
        setTimeout(()=> {
          _this.outputData = {status: "run cleared"}
          _this.btnState = RUN | END}, 5000)
      }
    },
    async onEndClicked() {
      this.btnState = 0
      await this.wasmObj.end(window.gofuncModObject, 'end')
      this.btnState = INIT
      this.outputData = {status: "ended (wasm deleted)"}
      this.wasmObj = null
    }
  },
  computed: {
    input: function() {return JSON.stringify(this.inputData)
                       .replace(/,/g, ",&nbsp;&nbsp;") },
    output: function() { return JSON.stringify(this.outputData)
                       .replace(/,/g, ',&nbsp;&nbsp;')},
    INIT: function() { return INIT},
    RUN: function() { return RUN },
    END: function() { return END }
  }
}
</script>

