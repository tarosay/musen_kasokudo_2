let vy = 0
let vx = 0
let 速度 = 0
let 新速度 = 0
let 周期 = 0
let 振動準備 = false
let 振動 = 0
let y = 0
let x = 0
let 今 = 0
let 名前Y = ""
let 名前X = ""
let しきい値 = 150
let 前回時刻 = -1
let 次はX = true
radio.setGroup(191)
if (input.buttonIsPressed(Button.A)) {
    名前X = "AX"
    名前Y = "AY"
    basic.showString("A")
} else {
    名前X = "BX"
    名前Y = "BY"
    basic.showString("B")
}
let 重力X = input.acceleration(Dimension.X)
let 重力Y = input.acceleration(Dimension.Y)
let 送信時刻 = input.runningTime()
basic.forever(function () {
    今 = input.runningTime()
    x = input.acceleration(Dimension.X)
    y = input.acceleration(Dimension.Y)
    // 重力成分の抽出
    重力X = 重力X * 0.9 + x * 0.1
    重力Y = 重力Y * 0.9 + y * 0.1
    // 振動成分
    振動 = y - 重力Y
    // 振動周期の測定
    if (振動 < 0 - しきい値) {
        振動準備 = true
    } else if (振動 > しきい値 && 振動準備) {
        振動準備 = false
        if (前回時刻 >= 0) {
            周期 = 今 - 前回時刻
            if (周期 >= 180 && 周期 <= 1200) {
                新速度 = 20000 / 周期
                if (新速度 > 100) {
                    新速度 = 100
                }
                速度 = 速度 * 0.5 + 新速度 * 0.5
            }
        }
        前回時刻 = 今
    }
    // 振動停止
    if (前回時刻 >= 0) {
        if (今 - 前回時刻 > 1200) {
            速度 = 0
            前回時刻 = -1
        }
    }
    // 移動速度
    vx = 速度 * 重力X / 1000
    vy = 速度 * Math.abs(重力Y) / 1000
    // 無線送信
    if (今 - 送信時刻 >= 100) {
        if (次はX) {
            radio.sendValue(名前X, Math.round(vx))
        } else {
            radio.sendValue(名前Y, Math.round(vy))
        }
        次はX = !(次はX)
        送信時刻 = 今
    }
    basic.pause(20)
})
