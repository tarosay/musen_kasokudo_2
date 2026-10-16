vy = 0
vx = 0
速度 = 0
新速度 = 0
周期 = 0
振動準備 = False
振動 = 0
y = 0
x = 0
今 = 0
名前Y = ""
名前X = ""
しきい値 = 150
前回時刻 = -1
次はX = True
radio.set_group(191)
if input.button_is_pressed(Button.A):
    名前X = "AX"
    名前Y = "AY"
    basic.show_string("A")
else:
    名前X = "BX"
    名前Y = "BY"
    basic.show_string("B")
重力X = input.acceleration(Dimension.X)
重力Y = input.acceleration(Dimension.Y)
送信時刻 = input.running_time()

def on_forever():
    global 今, x, y, 重力X, 重力Y, 振動, 振動準備, 周期, 新速度, 速度, 前回時刻, vx, vy, 次はX, 送信時刻
    今 = input.running_time()
    x = input.acceleration(Dimension.X)
    y = input.acceleration(Dimension.Y)
    # 重力成分の抽出
    重力X = 重力X * 0.9 + x * 0.1
    重力Y = 重力Y * 0.9 + y * 0.1
    # 振動成分
    振動 = y - 重力Y
    # 振動周期の測定
    if 振動 < 0 - しきい値:
        振動準備 = True
    elif 振動 > しきい値 and 振動準備:
        振動準備 = False
        if 前回時刻 >= 0:
            周期 = 今 - 前回時刻
            if 周期 >= 180 and 周期 <= 1200:
                新速度 = 20000 / 周期
                if 新速度 > 100:
                    新速度 = 100
                速度 = 速度 * 0.5 + 新速度 * 0.5
        前回時刻 = 今
    # 振動停止
    if 前回時刻 >= 0:
        if 今 - 前回時刻 > 1200:
            速度 = 0
            前回時刻 = -1
    # 移動速度
    vx = 速度 * 重力X / 1000
    vy = 速度 * abs(重力Y) / 1000
    # 無線送信
    if 今 - 送信時刻 >= 100:
        if 次はX:
            radio.send_value(名前X, Math.round(vx))
        else:
            radio.send_value(名前Y, Math.round(vy))
        次はX = not (次はX)
        送信時刻 = 今
    basic.pause(20)
basic.forever(on_forever)
