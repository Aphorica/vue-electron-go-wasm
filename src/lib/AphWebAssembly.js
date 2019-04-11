import fs from 'fs'
/**
 * Encapsulates GO wasm parts
 */
class AphWebAssembly {
  /**
   * Provide a compiled go filename for the WA to start
   */
  constructor(wasm_file_name) {
    if (!WebAssembly.instantiateStreaming) {
      // polyfill
      WebAssembly.instantiateStreaming = async (resp, importObject) => {
        const source = await (await resp).arrayBuffer();
        return await WebAssembly.instantiate(source, importObject);
      };
    }

    let _this = this

    this.go = new Go();
//    this.go._inst[exports] = this.go.instance.exports
    this.mod = null
    this.inst = null

/**/
    setTimeout(async ()=>{
      try {
      let wasm_binary = fs.readFileSync(wasm_file_name) // await fetch(wasm_file_name)
      let ctnr = await WebAssembly.instantiate(wasm_binary, _this.go.importObject)

      _this.inst = ctnr.instance
      _this.mod = ctnr.module
      
      _this.go.run(_this.inst)
      } catch(err) {
        console.log(err)
      }
    })
/** /
    WebAssembly.instantiateStreaming(fetch(wasm_file_name), this.go.importObject)
    .then((result) => {
        _this.mod = result.module;
        _this.inst = result.instance;
        _this.go.run(inst)
      })
      .catch((err)=>{
        console.log(err)
        _this.go = null
      })
/**/
  }

  /**
   * run the wasm created function with the supplied data
   */
  async run(func, data) {
    let retData
    if (true) { //this.inst) {
      await WebAssembly.instantiate(this.mod, this.go.importObject);
                  // reset instance

      retData = func(data)
    }
    return retData
  }

  /**
   * end the wasm session by calling the wasm supplied func with
   * a known endValue
   */
  async end(func, endValue) {
    func(endValue)
    this.go = null;
  }
}

export default AphWebAssembly