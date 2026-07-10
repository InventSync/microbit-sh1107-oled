namespace SH1107 {

    let address = 0x3C

    let buffer = pins.createBuffer(1024)


    //% block="initialize OLED"
    export function init() {

        let commands = [
            0xAE,
            0xD5,0x80,
            0xA8,0x7F,
            0xD3,0x00,
            0x40,
            0xAD,0x8B,
            0xA1,
            0xC8,
            0xDA,0x12,
            0x81,0xFF,
            0xD9,0x22,
            0xDB,0x35,
            0xA4,
            0xA6,
            0xAF
        ]

        for (let c of commands) {
            sendCommand(c)
        }

        clear()
        show()
    }


    function sendCommand(cmd:number){

        let buf = pins.createBuffer(2)

        buf[0]=0x00
        buf[1]=cmd

        pins.i2cWriteBuffer(address,buf)

    }


    //% block="clear OLED"
    export function clear(){

        for(let i=0;i<1024;i++){
            buffer[i]=0
        }

    }


    //% block="draw pixel x $x y $y"
    export function pixel(
        x:number,
        y:number
    ){

        let page = Math.idiv(y,8)

        let index = page*128+x

        buffer[index] |= 1 << (y%8)

    }



    //% block="update OLED"
    export function show(){

        for(let page=0;page<16;page++){

            sendCommand(0xB0+page)

            sendCommand(0x02)
            sendCommand(0x10)


            let data=pins.createBuffer(129)

            data[0]=0x40


            for(let x=0;x<128;x++){

                data[x+1]=buffer[page*128+x]

            }

            pins.i2cWriteBuffer(address,data)

        }

    }

}
