window.__require = function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var b = o.split("/");
        b = b[b.length - 1];
        if (!t[b]) {
          var a = "function" == typeof __require && __require;
          if (!u && a) return a(b, !0);
          if (i) return i(b, !0);
          throw new Error("Cannot find module '" + o + "'");
        }
        o = b;
      }
      var f = n[o] = {
        exports: {}
      };
      t[o][0].call(f.exports, function(e) {
        var n = t[o][1][e];
        return s(n || e);
      }, f, f.exports, e, t, n, r);
    }
    return n[o].exports;
  }
  var i = "function" == typeof __require && __require;
  for (var o = 0; o < r.length; o++) s(r[o]);
  return s;
}({
  CameraController: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "c79e5ndld9Et4rRR/5ExJdS", "CameraController");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        targetNode: {
          default: null,
          type: cc.Node
        },
        moveRangeX: cc.v2(-400, 400),
        moveRangeY: cc.v2(-700, 700)
      },
      start: function start() {},
      update: function update(dt) {
        if (null != this.targetNode) {
          var pos = this.targetNode.position;
          pos.x = cc.math.clamp(pos.x, this.moveRangeX.x, this.moveRangeX.y);
          pos.y = cc.math.clamp(pos.y, this.moveRangeY.x, this.moveRangeY.y);
          this.node.setPosition(pos);
        }
      }
    });
    cc._RF.pop();
  }, {} ],
  Food: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "9affe660uhGurFMjeAn75+k", "Food");
    "use strict";
    var FoodType;
    FoodType = cc.Enum({
      Apple: 0,
      Banana: 1,
      Bomb: 2
    });
    cc.Class({
      extends: cc.Component,
      properties: {
        type: {
          default: FoodType.Apple,
          type: FoodType
        },
        addScore: 10,
        addEnergy: 0,
        speedDownFactor: .5,
        id: -1,
        text: "",
        moveRangeX: cc.v2(-400, 400),
        moveRangeY: cc.v2(-700, 700)
      },
      onLoad: function onLoad() {},
      update: function update(dt) {
        if (this.willMove) {
          var currPos = this.node.position;
          currPos.x < this.moveRangeX.x && this.currDir.x < 0 && (this.currDir = this.currDir.scale(cc.v2(-1, 1)));
          currPos.x > this.moveRangeX.y && this.currDir.x > 0 && (this.currDir = this.currDir.scale(cc.v2(-1, 1)));
          currPos.y < this.moveRangeY.x && this.currDir.y < 0 && (this.currDir = this.currDir.scale(cc.v2(1, -1)));
          currPos.y > this.moveRangeY.y && this.currDir.y > 0 && (this.currDir = this.currDir.scale(cc.v2(1, -1)));
          var pos = currPos.add(this.currDir);
          this.node.setPosition(pos);
        }
      },
      init: function init(moveSpeed, moveRangeX, moveRangeY) {
        this.moveRangeX = moveRangeX;
        this.moveRangeY = moveRangeY;
        var ran1 = Math.random() > .5 ? 1 : -1;
        var ran2 = Math.random() > .5 ? 1 : -1;
        this.currDir = cc.v2(ran1, ran2).mul(moveSpeed / 1.414);
        setTimeout(function() {
          this.willMove = true;
        }.bind(this), 4e3);
      },
      initApple: function initApple(id, text) {
        this.id = id;
        this.text = text;
        this.node.children[0].getComponent(cc.Label).string = text;
      }
    });
    cc._RF.pop();
  }, {} ],
  GameManager: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "08637/D+/lCNqUK1C2sOZ2l", "GameManager");
    "use strict";
    var FoodType = cc.Enum({
      Apple: 0,
      Banana: 1,
      Bomb: 2
    });
    var FoodData = cc.Class({
      name: "FoodData",
      properties: {
        type: {
          default: FoodType.Apple,
          type: FoodType
        },
        maxNum: 99999,
        speedFactor: 0,
        spawnInterval: 2,
        maxShowNum: 4
      }
    });
    var LevelData = cc.Class({
      name: "LevelData",
      properties: {
        textListId: 0,
        snakeSpeedFactor: 1,
        foodDataList: [ FoodData ]
      }
    });
    var levelText0 = [ "\u95ef\u5173\u5f00\u59cb" ];
    var levelText1 = [ "\u7981\u6b62\u64c5\u81ea\u5360\u7528\u516c\u5171\u7eff\u5730\u3002" ];
    var levelText2 = [ "\u4e34\u65f6\u5360\u7528\u516c\u5171\u7eff\u5730\u671f\u9650\u4e0d\u5f97\u8d85\u8fc7\u4e00\u5e74\u3002", "\u7981\u6b62\u975e\u7eff\u5316\u517b\u62a4\u8d23\u4efb\u4eba\u64c5\u81ea\u4fee\u526a\u6811\u6728\u3002", "\u7eff\u5316\u5927\u4f7f\u6bcf\u5c4a\u4efb\u671f\u4e09\u5e74\uff0c\u53ef\u4ee5\u8fde\u7eed\u8058\u7528\u3002", "\u4efb\u4f55\u5355\u4f4d\u548c\u4e2a\u4eba\u4e0d\u5f97\u64c5\u81ea\u8fc1\u79fb\u3001\u780d\u4f10\u53e4\u6811\u540d\u6728\u3002", "\u8c03\u6574\u7eff\u5730\u8303\u56f4\u63a7\u5236\u7ebf\u4e0d\u5f97\u51cf\u5c11\u89c4\u5212\u7eff\u5730\u7684\u603b\u91cf\u3002", "\u5e02\u7eff\u5316\u884c\u653f\u4e3b\u7ba1\u90e8\u95e8\u5e94\u5f53\u6bcf\u4e24\u5e74\u53d1\u5e03\u5168\u5e02\u7eff\u5316\u767d\u76ae\u4e66\u3002", "\u6811\u9f84\u5728\u4e00\u767e\u5e74\u4ee5\u4e0a\u7684\u6811\u6728\uff0c\u5e94\u5f53\u7eb3\u5165\u53e4\u6811\u540d\u6728\u4fdd\u62a4\u8303\u56f4\u3002" ];
    var levelText3 = [ "\u516c\u5171\u5efa\u7b51\u548c\u5e02\u653f\u516c\u7528\u8bbe\u65bd\u4e0a\u5efa\u6210\u7684\u7acb\u4f53\u7eff\u5316\uff0c\u4e0d\u5f97\u5360\u7528\u3001\u62c6\u9664\u3002", "\u7eff\u5316\u884c\u653f\u4e3b\u7ba1\u90e8\u95e8\u8d1f\u8d23\u5bf9\u53e4\u6811\u540d\u6728\u8fdb\u884c\u75c5\u866b\u5bb3\u9632\u6cbb\u548c\u590d\u58ee\u3002", "\u4efb\u4f55\u5355\u4f4d\u548c\u4e2a\u4eba\u4e0d\u5f97\u64c5\u81ea\u6539\u53d8\u5df2\u5efa\u6210\u7684\u914d\u5957\u7eff\u5316\u7528\u5730\u7684\u529f\u80fd\u3002", "\u7eff\u5316\u5de5\u4f5c\u5e94\u5f53\u575a\u6301\u4ee5\u4eba\u4e3a\u672c\u3001\u56e0\u5730\u5236\u5b9c\u3001\u690d\u62a4\u5e76\u91cd\u3001\u4e25\u683c\u7ba1\u7406\u7684\u539f\u5219\u3002", "\u53e4\u6811\u540d\u6728\u6811\u51a0\u5782\u76f4\u6295\u5f71\u7ebf\u5916\u4e94\u7c73\u8303\u56f4\u5185\u4e3a\u53e4\u6811\u540d\u6728\u7684\u4fdd\u62a4\u8303\u56f4\u3002", "\u5b9e\u65bd\u7acb\u4f53\u7eff\u5316\u5e94\u5f53\u786e\u4fdd\u5176\u6240\u9644\u5efa\u7b51\u7269\u3001\u6784\u7b51\u7269\u5b89\u5168\u53ca\u76f8\u90bb\u533a\u57df\u5b89\u5168\u3002", "\u53e4\u6811\u540d\u6728\u517b\u62a4\u8d23\u4efb\u4eba\u5e94\u5f53\u63a5\u53d7\u7eff\u5316\u884c\u653f\u4e3b\u7ba1\u90e8\u95e8\u7684\u6307\u5bfc\u3001\u76d1\u7763\u548c\u68c0\u67e5\u3002", "\u7eff\u5730\uff0c\u662f\u6307\u4e13\u95e8\u7528\u4e8e\u6539\u5584\u57ce\u5e02\u751f\u6001\u3001\u4fdd\u62a4\u73af\u5883\u3001\u7f8e\u5316\u666f\u89c2\u7684\u6240\u6709\u7eff\u5316\u7528\u5730\u3002" ];
    var levelText4 = [ "\u6539\u53d8\u6c38\u4e45\u4fdd\u62a4\u7eff\u5730\u4f7f\u7528\u6027\u8d28\u7684\uff0c\u5e94\u5f53\u4e0d\u4f4e\u4e8e\u6539\u53d8\u9762\u79ef\u8865\u507f\u65b0\u7684\u6c38\u4e45\u4fdd\u62a4\u7eff\u5730\u3002", "\u65b0\u5efa\u5efa\u8bbe\u5de5\u7a0b\u9879\u76ee\u7684\u7acb\u4f53\u7eff\u5316\uff0c\u5e94\u5f53\u4e0e\u4e3b\u4f53\u5de5\u7a0b\u540c\u65f6\u8bbe\u8ba1\u3001\u540c\u65f6\u5efa\u8bbe\u3001\u540c\u65f6\u9a8c\u6536\u3002", "\u5bf9\u7eff\u5316\u4e8b\u4e1a\u505a\u51fa\u663e\u8457\u6210\u7ee9\u7684\u5355\u4f4d\u548c\u4e2a\u4eba\uff0c\u5e02\u3001\u533a\u4eba\u6c11\u653f\u5e9c\u53ef\u4ee5\u7ed9\u4e88\u8868\u5f70\u548c\u5956\u52b1\u3002", "\u8fdd\u53cd\u89c4\u5b9a\u635f\u5bb3\u53e4\u6811\u540d\u6728\u7684\uff0c\u7531\u7eff\u5316\u884c\u653f\u4e3b\u7ba1\u90e8\u95e8\u5904\u4e09\u5343\u5143\u4ee5\u4e0a\u4e00\u4e07\u5143\u4e00\u4e0b\u7f5a\u6b3e\u3002", "\u8fdd\u53cd\u89c4\u5b9a\u64c5\u81ea\u4fee\u526a\u6811\u6728\u7684\uff0c\u7531\u7eff\u5316\u884c\u653f\u4e3b\u7ba1\u90e8\u95e8\u6309\u7167\u6bcf\u682a\u4e8c\u5343\u5143\u7684\u6807\u51c6\u5904\u4ee5\u7f5a\u6b3e\u3002", "\u8fdd\u53cd\u89c4\u5b9a\u81f4\u4f7f\u6811\u6728\u6b7b\u4ea1\u7684\uff0c\u7531\u7eff\u5316\u884c\u653f\u4e3b\u7ba1\u90e8\u95e8\u6309\u7167\u6bcf\u682a\u4e09\u5343\u5143\u7684\u6807\u51c6\u5904\u4ee5\u7f5a\u6b3e\u3002", "\u672a\u7ecf\u6279\u51c6\u64c5\u81ea\u8fc1\u79fb\u6811\u6728\u7684\uff0c\u7531\u7eff\u5316\u884c\u653f\u4e3b\u7ba1\u90e8\u95e8\u6309\u7167\u6bcf\u682a\u4e94\u5343\u5143\u7684\u6807\u51c6\u5904\u4ee5\u7f5a\u6b3e\u3002", "\u672a\u7ecf\u6279\u51c6\u64c5\u81ea\u780d\u4f10\u6811\u6728\u7684\uff0c\u7531\u7eff\u5316\u884c\u653f\u4e3b\u7ba1\u90e8\u95e8\u6309\u7167\u6bcf\u682a\u4e00\u4e07\u5143\u7684\u6807\u51c6\u5904\u4ee5\u7f5a\u6b3e\u3002", "\u5df2\u51fa\u8ba9\u534a\u5e74\u4ee5\u4e0a\u672a\u5f00\u53d1\u7684\u5f85\u5efa\u5730\u4e3a\u4f5c\u5176\u4ed6\u7528\u9014\u7684\uff0c\u571f\u5730\u4f7f\u7528\u6743\u4eba\u5e94\u5f53\u8fdb\u884c\u7eff\u5316\u8986\u76d6\u3002", "\u8ba4\u79cd\u8ba4\u517b\u6811\u6728\u3001\u7eff\u5730\u7684\u5355\u4f4d\u548c\u4e2a\u4eba\uff0c\u53ef\u4ee5\u4eab\u6709\u6240\u8ba4\u79cd\u8ba4\u517b\u6811\u6728\u3001\u7eff\u5730\u4e00\u5b9a\u671f\u9650\u7684\u51a0\u540d\u6743\u3002" ];
    var levelText5 = [ "\u516c\u5171\u7eff\u5730\uff0c\u662f\u6307\u5411\u516c\u4f17\u5f00\u653e\u7684\u5404\u7c7b\u516c\u76ca\u6027\u516c\u56ed\u7eff\u5730\u3001\u8857\u65c1\u7eff\u5730\u3001\u9053\u8def\u7eff\u9053\u3001\u5e7f\u573a\u7eff\u5730\u3001\u6cb3\u9053\u7eff\u5730\u7b49\u3002", "\u64c5\u81ea\u8fc1\u79fb\u81f4\u53e4\u6811\u540d\u6728\u6b7b\u4ea1\u6216\u8005\u64c5\u81ea\u780d\u4f10\u53e4\u6811\u540d\u6728\u7684\uff0c\u6309\u7167\u6bcf\u682a\u4e09\u5341\u4e07\u5143\u4ee5\u4e0a\u4e94\u5341\u4e07\u5143\u4ee5\u4e0b\u7684\u6807\u51c6\u5904\u4ee5\u7f5a\u6b3e\u3002", "\u7acb\u4f53\u7eff\u5316\uff0c\u662f\u6307\u4ee5\u5efa\u7b51\u7269\u3001\u6784\u7b51\u7269\u4e3a\u8f7d\u4f53\uff0c\u4ee5\u690d\u7269\u4e3a\u6750\u6599\uff0c\u4ee5\u5c4b\u9876\u7eff\u5316\u3001\u67b6\u7a7a\u5c42\u7eff\u5316\u3001\u5899\u4f53\u7eff\u5316\u3001\u68da\u67b6\u7eff\u5316\u3001\u6865\u4f53\u7eff\u5316\u7b49\u65b9\u5f0f\u5b9e\u65bd\u7684\u7eff\u5316\u3002" ];
    var levelTextList = [ levelText0, levelText1, levelText2, levelText3, levelText4, levelText5 ];
    cc.Class({
      extends: cc.Component,
      properties: {
        uiManager: {
          default: null,
          type: cc.Node
        },
        snake: {
          default: null,
          type: cc.Node
        },
        foodApplePrefab: {
          default: null,
          type: cc.Prefab
        },
        foodBananaPrefab: {
          default: null,
          type: cc.Prefab
        },
        foodBombPrefab: {
          default: null,
          type: cc.Prefab
        },
        foodBaseSpeed: 1,
        avoidSnakeRadius: 200,
        avoidFoodRadius: 80,
        spawnRangeX: cc.v2(-400, 400),
        spawnRangeY: cc.v2(-700, 700),
        timeLimit: 150,
        levelDataList: [ LevelData ],
        isDebug: false,
        initAppleNum: 3,
        initBananaNum: 3,
        initBombNum: 3
      },
      isLastLevel: function isLastLevel() {
        return this.currLevel >= this.levelDataList.length - 1;
      },
      getSnakeSpeedFactor: function getSnakeSpeedFactor() {
        var level = Math.min(this.currLevel, this.levelDataList.length - 1);
        var currLevelData = this.levelDataList[level];
        return currLevelData.snakeSpeedFactor;
      },
      getFoodDataByType: function getFoodDataByType(type) {
        console.log("[GameManager] levelDataList", this.levelDataList.length);
        var level = Math.min(this.currLevel, this.levelDataList.length - 1);
        var currLevelData = this.levelDataList[level];
        if (type >= currLevelData.foodDataList.length) {
          console.log("[Error] no food data", level, type);
          return null;
        }
        return currLevelData.foodDataList[type];
      },
      getCurrLevelText: function getCurrLevelText() {
        var currLevelData = this.levelDataList[this.currLevel];
        var list = levelTextList[currLevelData.textListId];
        this.ranTextId || (this.ranTextId = cc.math.randomRangeInt(0, list.length));
        return list[this.ranTextId];
      },
      removePunctuationInText: function removePunctuationInText(str) {
        return str.replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?/\\uff0c/\\u3002/\\uff1b/\\uff1a/\\u201c/\\u201d/\\u300b/\\u300a/\|/\{/\}/\\u3001/\!/\~/\`]/g, "");
      },
      onLoad: function onLoad() {
        this.uiManager = this.uiManager.getComponent("UIManager");
        this.snake = this.snake.getComponent("Snake");
        this.currLevel = cc.sys.localStorage.getItem("_GAME_LEVEL");
        if (null == this.currLevel) {
          this.currLevel = 0;
          cc.sys.localStorage.setItem("_GAME_LEVEL", 0);
          console.log("[GameManager] == null");
        } else this.currLevel = parseInt(this.currLevel);
        console.log("[GameManager] currLevel", this.currLevel);
      },
      start: function start() {
        this.textCount = 0;
        this.currLevelText = this.removePunctuationInText(this.getCurrLevelText());
        this.currLevelTextLen = this.currLevelText.length;
        this.foodList = [];
        this.foodSpawnCountList = [ 0, 0, 0 ];
        this.updateProgressUI(0);
      },
      startGame: function startGame() {
        if (this.isDebug) {
          for (var i = 0; i < this.initAppleNum; i++) this.spawnFood(FoodType.Apple);
          for (var i = 0; i < this.initBananaNum; i++) this.spawnFood(FoodType.Banana);
          for (var i = 0; i < this.initBombNum; i++) this.spawnFood(FoodType.Bomb);
        } else {
          this.initFood(FoodType.Apple);
          this.initFood(FoodType.Banana);
          this.initFood(FoodType.Bomb);
        }
      },
      initFood: function initFood(foodType) {
        var foodData = this.getFoodDataByType(foodType);
        if (null == foodData) return;
        var num = Math.min(foodData.maxShowNum, foodData.maxNum);
        console.log("[GameManager] initFood", foodType, num);
        for (var i = 0; i < num; i++) this.spawnFood(foodType);
      },
      spawnFood: function spawnFood(foodType) {
        if (foodType == FoodType.Apple && this.textCount >= this.currLevelTextLen) return;
        var foodData = this.getFoodDataByType(foodType);
        if (this.foodSpawnCountList[foodType] >= foodData.maxNum) return;
        var prefab;
        prefab = foodType == FoodType.Apple ? this.foodApplePrefab : foodType == FoodType.Banana ? this.foodBananaPrefab : this.foodBombPrefab;
        var newFood = cc.instantiate(prefab);
        this.node.parent.addChild(newFood);
        var randomPos = this.getRandomPosForFood();
        newFood.setPosition(randomPos);
        var foodCom = newFood.getComponent("Food");
        var speed = foodData.speedFactor * this.foodBaseSpeed;
        var moveRangeX = cc.v2(this.spawnRangeX.x - 10, this.spawnRangeX.y + 10);
        var moveRangeY = cc.v2(this.spawnRangeY.x - 10, this.spawnRangeY.y + 10);
        foodCom.init(speed, moveRangeX, moveRangeY);
        if (foodType == FoodType.Apple) {
          foodCom.initApple(this.textCount, this.currLevelText[this.textCount]);
          this.textCount++;
        }
        this.foodList.push(newFood);
        this.foodSpawnCountList[foodType]++;
      },
      spawnFoodDelay: function spawnFoodDelay(foodType) {
        var foodData = this.getFoodDataByType(foodType);
        if (null == foodData) return;
        if (this.foodSpawnCountList[foodType] >= foodData.maxNum) return;
        setTimeout(function() {
          this.spawnFood(foodType);
        }.bind(this), 1e3 * foodData.spawnInterval);
      },
      onSnakeEatFood: function onSnakeEatFood(foodType) {
        this.spawnFoodDelay(foodType);
        foodType == FoodType.Apple && this.updateProgressUI(this.snake.currTextId + 1);
      },
      updateProgressUI: function updateProgressUI(nextTextId) {
        var midText = "";
        var leftText = "";
        var rightText = "";
        for (var i = 0; i < this.currLevelText.length; i++) i < nextTextId ? leftText += this.currLevelText[i] + " " : i > nextTextId ? rightText += this.currLevelText[i] + " " : midText = this.currLevelText[i];
        this.uiManager.updateProgressText(midText, 0);
        this.uiManager.updateProgressText(leftText, 1);
        this.uiManager.updateProgressText(rightText, 2);
      },
      getRandomPosInRange: function getRandomPosInRange(rangeX, rangeY) {
        var x = cc.math.randomRange(rangeX.x, rangeX.y);
        var y = cc.math.randomRange(rangeY.x, rangeY.y);
        return cc.v2(x, y);
      },
      getRandomPosForFood: function getRandomPosForFood() {
        var maxTryCount = 30;
        var tryCount = 0;
        var randomPos;
        var dist;
        var minFoodDist;
        do {
          randomPos = this.getRandomPosInRange(this.spawnRangeX, this.spawnRangeY);
          dist = cc.Vec2.distance(randomPos, this.snake.node.position);
          minFoodDist = 99999;
          for (var i = 0; i < this.foodList.length; i++) {
            if (null == this.foodList[i]) continue;
            var foodDist = cc.Vec2.distance(randomPos, this.foodList[i].position);
            minFoodDist > foodDist && (minFoodDist = foodDist);
          }
          tryCount += 1;
        } while ((dist < this.avoidSnakeRadius || minFoodDist < this.avoidFoodRadius) && tryCount < maxTryCount);
        tryCount > 1 && console.log("[GameManager] tryCount", tryCount, dist);
        return randomPos;
      }
    });
    cc._RF.pop();
  }, {} ],
  Sample: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "5ea90qW/3xIgYXdOjoAxyXb", "Sample");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {},
      start: function start() {}
    });
    cc._RF.pop();
  }, {} ],
  SetZIndex: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "c19e4GfHnhKLZW6Mj418Fnu", "SetZIndex");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        zIndex: 0,
        setForChildren: true
      },
      onLoad: function onLoad() {
        this.node.zIndex = this.zIndex;
        this.setForChildren && this.setZIndexForChildren(this.node);
      },
      start: function start() {},
      setZIndexForChildren: function setZIndexForChildren(node) {
        node.zIndex = this.zIndex;
        for (var i = 0; i < node.children.length; i++) node.children[i].zIndex = this.zIndex;
      }
    });
    cc._RF.pop();
  }, {} ],
  SettlePanel: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "24192WCRVBMpaGjmSINkx7R", "SettlePanel");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        gameManager: {
          default: null,
          type: cc.Node
        },
        settleWinPanel: {
          default: null,
          type: cc.Node
        },
        settleLosePanel: {
          default: null,
          type: cc.Node
        },
        newRecordBanner: {
          default: null,
          type: cc.Node
        },
        passAllBanner: {
          default: null,
          type: cc.Node
        },
        settleScoreText1: {
          default: null,
          type: cc.Label
        },
        settleScoreText2: {
          default: null,
          type: cc.Label
        },
        gameOverBanner: {
          default: null,
          type: cc.Node
        },
        timeOutBanner: {
          default: null,
          type: cc.Node
        },
        lotteryBtn: {
          default: null,
          type: cc.Node
        }
      },
      onLoad: function onLoad() {
        this.gameManager = this.gameManager.getComponent("GameManager");
      },
      start: function start() {},
      onGameFinish: function onGameFinish(isWin, isTimeOut, score) {
        this.settleScoreText1.string = score;
        this.settleScoreText2.string = score;
        if (isWin) {
          this.settleWinPanel.active = true;
          this.newRecordBanner.active = false;
          this.passAllBanner.active = false;
          if (this.gameManager.isLastLevel()) {
            this.passAllBanner.active = true;
            this.lotteryBtn.active = true;
          } else {
            var level = this.gameManager.currLevel;
            var SCORE_KEY = "_LEVEL_SCORE_" + level;
            var savedScore = cc.sys.localStorage.getItem(SCORE_KEY);
            null == savedScore && (savedScore = "0");
            score = parseInt(score);
            savedScore = parseInt(savedScore);
            console.log("level, score, savedScore:", level, score, savedScore);
            if (score > savedScore) {
              this.newRecordBanner.active = true;
              cc.sys.localStorage.setItem(SCORE_KEY, score);
            }
          }
        } else {
          this.settleLosePanel.active = true;
          this.gameOverBanner.active = !isTimeOut;
          this.timeOutBanner.active = isTimeOut;
        }
      },
      onNextLevelBtn: function onNextLevelBtn() {
        console.log("onNextLevelBtn");
        var level = cc.sys.localStorage.getItem("_GAME_LEVEL");
        level = parseInt(level);
        cc.sys.localStorage.setItem("_GAME_LEVEL", level + 1);
        cc.sys.localStorage.setItem("_START_GAME", 1);
        cc.director.loadScene(cc.director.getScene().name);
      },
      onRetryBtn: function onRetryBtn() {
        console.log("onRetryBtn");
        cc.sys.localStorage.setItem("_START_GAME", 1);
        cc.director.loadScene(cc.director.getScene().name);
      },
      onHomeBtn: function onHomeBtn() {
        console.log("onHomeBtn");
        cc.director.loadScene(cc.director.getScene().name);
      },
      onLotteryBtn: function onLotteryBtn() {
        console.log("onLotteryBtn");
      },
      onViewRankBtn: function onViewRankBtn() {
        console.log("onViewRankBtn");
      },
      onShareBtn: function onShareBtn() {
        console.log("onShareBtn");
      }
    });
    cc._RF.pop();
  }, {} ],
  Snake: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "db03egJOmFALoxy8y5zKKBE", "Snake");
    "use strict";
    var FoodType;
    FoodType = cc.Enum({
      Apple: 0,
      Banana: 1,
      Bomb: 2
    });
    var GameState;
    GameState = cc.Enum({
      Pause: 0,
      Start: 1,
      Playing: 2,
      Finish: 3
    });
    cc.Class({
      extends: cc.Component,
      properties: {
        gameState: {
          default: GameState.Start,
          type: GameState
        },
        bodyPrefab: {
          default: null,
          type: cc.Prefab
        },
        overlayTouch: {
          default: null,
          type: cc.Node
        },
        gameManager: {
          default: null,
          type: cc.Node
        },
        bodyNum: 2,
        sectionLen: 25,
        moveTime: 20,
        collisionDelayTime: 3,
        headZIndex: 999,
        maxSkillEnergy: 100,
        energyConsumeRate: 10,
        activeSkillPressTime: .5,
        speedUpFactor: 1.5,
        speedRecoverFactor: .5
      },
      startGame: function startGame() {
        this.changeGameState(GameState.Playing);
      },
      changeGameState: function changeGameState(newState) {
        this.gameState = newState;
      },
      isGamePause: function isGamePause() {
        return this.gameState == GameState.Pause;
      },
      isGameStart: function isGameStart() {
        return this.gameState == GameState.Start;
      },
      isGamePlaying: function isGamePlaying() {
        return this.gameState == GameState.Playing;
      },
      isGameFinish: function isGameFinish() {
        return this.gameState == GameState.Finish;
      },
      onLoad: function onLoad() {
        console.log("onLoad");
        this.gameTimer = 0;
        this.gameScore = 0;
        this.skillEnergy = 0;
        this.isGameStart = false;
        this.isSpeedUp = false;
        this.currTextId = -1;
        this.snakeArray = [];
        this.snakeArray.push(this.node);
        this.pointArray = [];
        this.dir = cc.v2(0, 1);
        this.dirAngle = 0;
        var growDir = this.dir.mul(-1);
        this.turnPosList = [];
        this.turnDirList = [];
        for (var i = 0; i < 5; i++) {
          var growLen = growDir.mul(i * this.sectionLen);
          this.turnPosList.push(this.node.position.add(growLen));
          this.turnDirList.push(growDir);
        }
        this.headPointsNum = 0;
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        this.startTouchPos = cc.v2.ZERO;
        this.overlayTouch.on("touchstart", this.onTouchStart, this);
        this.overlayTouch.on("touchmove", this.onTouchMove, this);
        this.overlayTouch.on("touchend", this.onTouchEnd, this);
        this.overlayTouch.on("touchcancel", this.onTouchCancel, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
      },
      onKeyDown: function onKeyDown(event) {
        switch (event.keyCode) {
         case cc.macro.KEY.a:
          this.handleInput(-300, 0);
          break;

         case cc.macro.KEY.d:
          this.handleInput(300, 0);
          break;

         case cc.macro.KEY.w:
          this.handleInput(0, 300);
          break;

         case cc.macro.KEY.s:
          this.handleInput(0, -300);
          break;

         case cc.macro.KEY.space:
          console.log("AAAA");
          this.isSpeedUpDebug = true;
          break;

         case cc.macro.KEY.p:
          this.changeGameState(GameState.Finish);
          this.uiManager.onGameFinish(true);
        }
      },
      onTouchStart: function onTouchStart(event) {
        this.isTouching = true;
        this.touchTimer = 0;
        this.handleInputTimer = 1;
        this.startTouchPos = event.getLocation();
        this.lastTouchPos = event.getLocation();
      },
      onTouchMove: function onTouchMove(event) {
        var deltaVec = event.getLocation().sub(this.lastTouchPos);
        var absX = Math.abs(deltaVec.x);
        var absY = Math.abs(deltaVec.y);
        if (absX + absY > 30) {
          if (this.handleInputTimer < .2) return;
          this.handleInputTimer = 0;
          this.handleInput(deltaVec.x, deltaVec.y);
          this.lastTouchPos = event.getLocation();
        }
      },
      onTouchEnd: function onTouchEnd(event) {
        this.isTouching = false;
        this.isSpeedUp = false;
        var deltaVec = event.getLocation().sub(this.startTouchPos);
        this.handleInput(deltaVec.x, deltaVec.y);
      },
      onTouchCancel: function onTouchCancel(event) {
        this.isTouching = false;
        this.isSpeedUp = false;
        var deltaVec = event.getLocation().sub(this.startTouchPos);
        this.handleInput(deltaVec.x, deltaVec.y);
      },
      handleInput: function handleInput(deltaX, deltaY) {
        if (!this.isGameStart) return;
        var absX = Math.abs(deltaX);
        var absY = Math.abs(deltaY);
        if (absX + absY > 20) {
          var dir = null;
          var dirAngle = 0;
          if (absX > absY) if (deltaX > 0) {
            dir = cc.v2(1, 0);
            dirAngle = 270;
          } else {
            dir = cc.v2(-1, 0);
            dirAngle = 90;
          } else if (deltaY > 0) {
            dir = cc.v2(0, 1);
            dirAngle = 0;
          } else {
            dir = cc.v2(0, -1);
            dirAngle = 180;
          }
          if (null == this.dir || dir.x + this.dir.x != 0 && dir.y + this.dir.y != 0) {
            if (null != this.dir) {
              this.turnPosList.push(this.node.position);
              this.turnDirList.push(this.dir.mul(-1));
              var len = this.turnPosList.length;
            }
            this.node.angle = dirAngle;
            this.dir = dir;
          }
        }
      },
      start: function start() {
        console.log("start");
        this.gameManager = this.gameManager.getComponent("GameManager");
        this.uiManager = this.gameManager.uiManager;
        var factor = this.gameManager.getSnakeSpeedFactor();
        this.speed = this.sectionLen / this.moveTime * factor;
        this.speedFactor = 1;
        console.log("snakeSpeed", this.speed, factor);
        for (var i = 1; i <= this.bodyNum; i++) this.getNewBody("", true);
      },
      randomColor: function randomColor() {
        var red = Math.round(255 * Math.random());
        var green = Math.round(255 * Math.random());
        var blue = Math.round(255 * Math.random());
        return new cc.Color(red, green, blue);
      },
      randomPos: function randomPos() {
        var width = this.node.parent.width;
        var height = this.node.parent.height;
        var x = Math.round(Math.random() * width) - width / 2;
        var y = Math.round(Math.random() * height) - height / 2;
        return cc.v2(x, y);
      },
      getNewBody: function getNewBody(text, isInit) {
        var newBody = cc.instantiate(this.bodyPrefab);
        var snakeLen = this.snakeArray.length;
        snakeLen > this.bodyNum ? newBody.curIndex = this.snakeArray[snakeLen - 1].curIndex : newBody.curIndex = 0;
        if (1 == snakeLen || isInit) {
          var dir = cc.v2(0, 1);
          newBody.setPosition(this.node.position.sub(dir.mul(this.sectionLen * snakeLen)));
        } else {
          var lastBody = this.snakeArray[snakeLen - 1];
          var lastBOBody = this.snakeArray[snakeLen - 2];
          var dir = lastBOBody.position.sub(lastBody.position).normalize();
          newBody.setPosition(lastBody.position.sub(dir.mul(this.sectionLen)));
        }
        newBody.children[0].getComponent(cc.Label).string = text;
        this.node.parent.addChild(newBody);
        this.snakeArray.push(newBody);
        snakeLen < 4 && newBody.getComponent(cc.CircleCollider).destroy();
        this.changeZIndex();
      },
      rotateHead: function rotateHead(headPos) {
        var angle = 180 * cc.v2(1, 0).signAngle(headPos) / Math.PI;
        this.node.angle = angle - 90;
      },
      getCurrSpeed: function getCurrSpeed() {
        return this.isSpeedUp || this.isSpeedUpDebug ? this.speed * this.speedFactor * this.speedUpFactor : this.speed * this.speedFactor;
      },
      moveSnake: function moveSnake() {
        var speed = this.getCurrSpeed();
        var dist = this.dir.mul(speed);
        this.node.setPosition(this.node.position.add(dist));
        var headPos = this.node.position;
        var headDir = this.dir.mul(-1);
        var trunDistList = [];
        var len = this.turnPosList.length;
        0 != headDir.x ? trunDistList.push(Math.abs(headPos.x - this.turnPosList[len - 1].x)) : trunDistList.push(Math.abs(headPos.y - this.turnPosList[len - 1].y));
        for (var i = len - 1; i > 0; i--) 0 != this.turnDirList[i].x ? trunDistList.push(Math.abs(this.turnPosList[i].x - this.turnPosList[i - 1].x)) : trunDistList.push(Math.abs(this.turnPosList[i].y - this.turnPosList[i - 1].y));
        for (var i = 1; i < this.snakeArray.length; i++) {
          var lenDist = i * this.sectionLen;
          var idx = 0;
          for (var j = 0; j < trunDistList.length; j++) {
            if (lenDist <= trunDistList[j]) {
              idx = j;
              break;
            }
            lenDist -= trunDistList[j];
          }
          if (0 == idx) this.snakeArray[i].setPosition(headPos.add(headDir.mul(lenDist))); else {
            idx = Math.max(len - idx, 0);
            var dir = this.turnDirList[idx];
            var pos = this.turnPosList[idx].add(dir.mul(lenDist));
            this.snakeArray[i].setPosition(pos);
          }
        }
      },
      changeZIndex: function changeZIndex() {
        for (var i = 0; i < this.snakeArray.length; i++) this.snakeArray[i].zIndex = this.headZIndex - i;
      },
      onCollisionEnter: function onCollisionEnter(other, self) {
        if (!this.isGamePlaying()) return;
        console.log("onCollisionEnter", other.node.group);
        if (other.node.group.includes("food")) {
          var food = other.node.getComponent("Food");
          console.log("food", food.type);
          var isWin = false;
          if (0 == food.type) {
            if (this.currTextId != food.id - 1) {
              console.log("fail: wrong text", food.id, this.currTextId);
              other.node.setPosition(this.gameManager.getRandomPosForFood());
              return;
            }
            this.currTextId = food.id;
            this.getNewBody(food.text, false);
            this.currTextId >= this.gameManager.currLevelTextLen - 1 && (isWin = true);
          } else 1 == food.type || 2 == food.type && (this.speedFactor *= food.speedDownFactor);
          this.gameScore += food.addScore;
          this.skillEnergy += food.addEnergy;
          this.skillEnergy > this.maxSkillEnergy && (this.skillEnergy = this.maxSkillEnergy);
          this.uiManager.onScoreChanged(food.addScore);
          this.uiManager.updateEnergyBar(this.skillEnergy / this.maxSkillEnergy);
          other.node.removeFromParent();
          this.gameManager.onSnakeEatFood(food.type);
          if (isWin) {
            this.changeGameState(GameState.Finish);
            this.uiManager.onGameFinish(true);
          }
        } else if (this.gameTimer > this.collisionDelayTime) {
          this.changeGameState(GameState.Finish);
          this.uiManager.onGameFinish(false, false);
        }
      },
      finishGameOnTimeOut: function finishGameOnTimeOut() {
        this.changeGameState(GameState.Finish);
        this.uiManager.onGameFinish(false, true);
      },
      update: function update(dt) {
        if (!this.isGamePlaying()) return;
        if (this.dir) {
          this.gameTimer += dt;
          if (this.gameTimer < 3.5) return;
          this.isGameStart = true;
          if (this.speedFactor < 1) {
            this.speedFactor += dt * this.speedRecoverFactor;
            this.speedFactor > 1 && (this.speedFactor = 1);
          }
          if (this.isTouching && this.skillEnergy > 0 && !this.isSpeedUp) {
            this.touchTimer += dt;
            this.handleInputTimer += dt;
            if (this.touchTimer > this.activeSkillPressTime) {
              this.isSpeedUp = true;
              this.uiManager.showHintText("\u52a0\u901f\uff01");
            }
          }
          if (this.isSpeedUp) {
            this.skillEnergy -= dt * this.energyConsumeRate;
            if (this.skillEnergy <= 0) {
              this.skillEnergy = 0;
              this.isSpeedUp = false;
            }
            this.uiManager.updateEnergyBar(this.skillEnergy / this.maxSkillEnergy);
          }
          this.moveSnake();
        }
      }
    });
    cc._RF.pop();
  }, {} ],
  UIManager: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "a3d916enitFVJF4i3GHw+kh", "UIManager");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        gameManager: {
          default: null,
          type: cc.Node
        },
        mainPanel: {
          default: null,
          type: cc.Node
        },
        startPanel: {
          default: null,
          type: cc.Node
        },
        hintPanel: {
          default: null,
          type: cc.Node
        },
        gamePanel: {
          default: null,
          type: cc.Node
        },
        settleWinPanel: {
          default: null,
          type: cc.Node
        },
        settleLosePanel: {
          default: null,
          type: cc.Node
        },
        animationPanel: {
          default: null,
          type: cc.Node
        },
        startLevelText: {
          default: null,
          type: cc.RichText
        },
        targetText: {
          default: null,
          type: cc.Label
        },
        hintPanelShowTime: 10,
        hintTimerText: {
          default: null,
          type: cc.Label
        },
        levelText: {
          default: null,
          type: cc.Label
        },
        scoreText: {
          default: null,
          type: cc.Label
        },
        timerText: {
          default: null,
          type: cc.Label
        },
        energyBar: {
          default: null,
          type: cc.ProgressBar
        },
        progressMidText: {
          default: null,
          type: cc.Label
        },
        progressLeftText: {
          default: null,
          type: cc.Label
        },
        progressRightText: {
          default: null,
          type: cc.Label
        },
        resumeGameNode: {
          default: null,
          type: cc.Node
        },
        flyScorePrefab: {
          default: null,
          type: cc.Prefab
        },
        hintTextPrefab: {
          default: null,
          type: cc.Prefab
        },
        countTextPrefab: {
          default: null,
          type: cc.Prefab
        }
      },
      start: function start() {
        this.gameManager = this.gameManager.getComponent("GameManager");
        this.snake = this.gameManager.snake;
        this.mainPanel.active = true;
        this.startPanel.active = false;
        this.hintPanel.active = false;
        this.gamePanel.active = false;
        this.settleWinPanel.active = false;
        this.settleLosePanel.active = false;
        this.settlePanel = this.settleWinPanel.getComponent("SettlePanel");
        this.gameTimer = this.gameManager.timeLimit;
        this.timerText.string = this.timeToString(this.gameTimer);
        this.countTextTimer = 3;
        this.timerFunc = function() {
          if (this.countTextTimer > 0) {
            this.showCountText(this.countTextTimer + "");
            this.countTextTimer -= 1;
            return;
          }
          if (this.gameTimer <= 0) return;
          this.gameTimer -= 1;
          this.timerText.string = this.timeToString(this.gameTimer);
          this.gameTimer <= 0 && this.snake.finishGameOnTimeOut();
        };
        var level = cc.sys.localStorage.getItem("_GAME_LEVEL");
        level = parseInt(level);
        this.levelText.string = "\u7b2c" + (level + 1) + "\u5173";
        this.startLevelText.string = "\u7b2c <size=80>" + (level + 1) + "</> \u5173";
        var currLevelText = this.gameManager.getCurrLevelText();
        var showText = "";
        for (var i = 0; i < currLevelText.length; i++) {
          showText += currLevelText[i];
          i % 8 == 7 && i < currLevelText.length - 2 && (showText += "\n");
        }
        this.targetText.string = showText;
        this.currScore = 0;
        this.scoreText.string = "0";
        this.updateEnergyBar(0);
        this.hintTimer = this.hintPanelShowTime;
        this.hintTimerFunc = function() {
          if (this.hintTimer <= 0) return;
          this.hintTimer -= 1;
          this.hintTimerText.string = this.hintTimer;
          this.hintTimer <= 0 && this.startGame();
        };
        var shouldStartGame = cc.sys.localStorage.getItem("_START_GAME");
        shouldStartGame = null != shouldStartGame && 1 == shouldStartGame;
        if (shouldStartGame) {
          cc.sys.localStorage.setItem("_START_GAME", 0);
          this.onStartGameBtn();
        }
      },
      timeToString: function timeToString(timeInSec) {
        var min = Math.floor(timeInSec / 60);
        var sec = timeInSec % 60;
        sec < 10 && (sec = "0" + sec);
        return min + ":" + sec;
      },
      onScoreChanged: function onScoreChanged(diff) {
        this.currScore += diff;
        this.scoreText.string = this.currScore;
        this.showFlyScore(diff);
      },
      updateEnergyBar: function updateEnergyBar(value) {
        this.energyBar.progress = value;
      },
      updateProgressText: function updateProgressText(text, id) {
        if (0 == id) {
          this.progressMidText.string = text;
          this.progressMidText.node.parent.getComponent(cc.Animation).play();
        } else 1 == id ? this.progressLeftText.string = text : this.progressRightText.string = text;
      },
      showFlyScore: function showFlyScore(score) {
        var flyScore;
        var text;
        if (score > 0) {
          flyScore = cc.instantiate(this.flyScorePrefab);
          flyScore.getComponent(cc.Animation).play("fly_score_2");
          text = "+" + score;
        }
        if (score < 0) {
          flyScore = cc.instantiate(this.flyScorePrefab);
          flyScore.getComponent(cc.Animation).play("fly_score");
          text = "" + score;
        }
        if (flyScore) {
          flyScore.children[0].getComponent(cc.Label).string = text;
          this.animationPanel.addChild(flyScore);
          setTimeout(function() {
            flyScore.destroy();
          }.bind(this), 2e3);
        }
      },
      showHintText: function showHintText(text) {
        var hint = cc.instantiate(this.hintTextPrefab);
        hint.children[0].getComponent(cc.Label).string = text;
        this.animationPanel.addChild(hint);
        setTimeout(function() {
          hint.destroy();
        }.bind(this), 3e3);
      },
      showCountText: function showCountText(text) {
        var node = cc.instantiate(this.countTextPrefab);
        node.children[0].getComponent(cc.Label).string = text;
        this.animationPanel.addChild(node);
        setTimeout(function() {
          node.destroy();
        }.bind(this), 2e3);
      },
      onStartGameBtn: function onStartGameBtn() {
        console.log("onStartGameBtn");
        this.mainPanel.active = false;
        this.startPanel.active = true;
        setTimeout(function() {
          this.startPanel.active = false;
          this.hintPanel.active = true;
          this.schedule(this.hintTimerFunc, 1, 999, 0);
        }.bind(this), 2e3);
      },
      onSkipHintBtn: function onSkipHintBtn() {
        console.log("onSkipHintBtn");
        this.startGame();
      },
      startGame: function startGame() {
        console.log("startGame");
        if (this.isGameStart) return;
        this.isGameStart = true;
        this.mainPanel.active = false;
        this.startPanel.active = false;
        this.hintPanel.active = false;
        this.gamePanel.active = true;
        this.snake.startGame();
        this.gameManager.startGame();
        this.schedule(this.timerFunc, 1, 999999, .5);
      },
      onGameFinish: function onGameFinish(isWin, isTimeOut) {
        console.log("onGameFinish", isWin, isTimeOut);
        this.unschedule(this.timerFunc);
        this.settlePanel.onGameFinish(isWin, isTimeOut, this.scoreText.string);
      },
      pauseGame: function pauseGame() {
        this.resumeGameNode.active = true;
        cc.game.pause();
      },
      resumeGame: function resumeGame() {
        this.resumeGameNode.active = false;
        cc.game.resume();
      },
      resetAll: function resetAll() {
        console.log("resetAll");
        cc.sys.localStorage.clear();
        cc.director.loadScene(cc.director.getScene().name);
      },
      onRankButton: function onRankButton() {
        console.log("onRankButton");
      },
      onLuckButton: function onLuckButton() {
        console.log("onLuckButton");
      },
      onRuleButton: function onRuleButton() {
        console.log("onRuleButton");
      }
    });
    cc._RF.pop();
  }, {} ]
}, {}, [ "CameraController", "Food", "GameManager", "Sample", "SetZIndex", "SettlePanel", "Snake", "UIManager" ]);