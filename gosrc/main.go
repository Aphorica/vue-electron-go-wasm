package main

import "fmt"
import "syscall/js"
import "encoding/json"

var c chan bool

func main() {
	var modObjectFunc js.Func

	c = make(chan bool)

	modObjectFunc = js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		dataStr := args[0].String()
		if dataStr == "end" {
			fmt.Println("GO: ModObjectFunc release...")
			modObjectFunc.Release()
			c <- true
			return nil
		}

		fmt.Println("GO: incoming JSON: ")
		fmt.Println("  " + dataStr)

		var data interface{}
		err := json.Unmarshal([]byte(dataStr), &data)
		dataMap := data.(map[string]interface{})
		dataMap["score"] = 95

		retBytes, err := json.Marshal(dataMap)
		if err != nil {
			fmt.Println("GO: Error marshaling modified structure: " + err.Error())
			return nil
		}

		retStr := string(retBytes)
		return retStr
	})

	fmt.Println("GO: setting global js function")
	js.Global().Set("gofuncModObject", modObjectFunc)
	<-c
}
