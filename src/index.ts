/*
 * @Author: BATU1579
 * @CreateDate: 2022-05-24 16:58:03
 * @LastEditor: BATU1579
 * @LastTime: 2022-09-23 17:45:32
 * @FilePath: \\src\\index.ts
 * @Description: 脚本入口
 */
import {} from "./global";
import { init } from "./lib/init";
import {} from "widget-operation";
import {} from "keys";
import {} from "device";

init();
console.show();
holyBack();
let errTimes = 0;
console.log("看看设备的分辨率，宽", device.width, "高", device.height);

app.launchApp("贝贝管理");
sleep(5000);
holyBack();
app.launchApp("贝贝管理");
sleep(5000);
if (checkLogin()) {
  doLogin();
}

while (errTimes < 3) {
  const success = readZiXun();
  if (!success) {
    errTimes++;
  }
  holyBack();
}
console.hide();

function readZiXun(): boolean {
  app.launchApp("贝贝管理");
  sleep(5000);
  const zixunBtn = text("资讯").findOne();
  if (zixunBtn) {
    console.log("这是啥？资讯，点一下");
    zixunBtn.parent()?.click();
    sleep(5000);
    console.log("刷新一下");
    swipe(
      device.width / 2,
      device.height / 2,
      device.width / 2,
      (device.height * 2) / 3,
      1000
    );
    sleep(2000);
    for (let i = 0; i < 5; i++) {
      if (className("android.widget.ImageView").depth(21).exists()) {
        console.log("还在刷新？再等五秒看看");
        sleep(5000);
      } else {
        break;
      }
      if (i == 4) {
        console.log("妈的不等了，重开");
        return false;
      }
    }

    const readButtons = id("com.shineyue.pm:id/tv_news_is_read").find();
    if (readButtons.empty()) {
      console.log("没找到╭(╯^╰)╮");
      return false;
    } else {
      try {
        readButtons.forEach((readButton) => {
          if (readButton.text() !== "已读") {
            console.hide();
            sleep(1000);
            click(readButton.bounds().centerX(), readButton.bounds().centerY());
            sleep(1000);
            console.show();
            sleep(8000);
            throw new Error("Stop the loop");
          }
        });
      } catch (e) {
        console.log("点掉一个未读，再瞅瞅还有没有未读");
        return true;
      }
      console.log("没未读了?");
      return false;
    }
  } else {
    console.log("资讯按钮不存在");
    return false;
  }
}

function holyBack(): void {
  for (let i = 0; i < 7; i++) {
    back();
    sleep(500);
  }
  sleep(1500);
}

function checkLogin(): boolean {
  if (text("账号登录").exists()) {
    return true;
  }
  return false;
}

function doLogin(): void {
  console.log(text("账号登录").exists());
  text("账号登录").findOnce()!.click();
  sleep(1000);
  id("et_zjhm").findOne().click();
  const password = hamibot.env._BBPWD;
  id("et_zjhm").findOne().setText(password);
  const tmp = id("iv_yinsi").findOne();
  click(tmp.bounds().centerX(), tmp.bounds().centerY());
  sleep(1000);
  id("bt_sure").findOne().click();
  sleep(5000);
}
