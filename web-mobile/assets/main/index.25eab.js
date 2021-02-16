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
  Fruit: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "365b4UAiQRBA7QXa2IuFMmj", "Fruit");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        id: 0
      },
      init: function init(data) {
        this.id = data.id;
        var sp = this.node.getComponent(cc.Sprite);
        sp.spriteFrame = data.iconSF;
      },
      start: function start() {},
      onBeginContact: function onBeginContact(contact, self, other) {
        if (self.node && other.node) {
          var s = self.node.getComponent("Fruit");
          var o = other.node.getComponent("Fruit");
          s && o && s.id === o.id && self.node.emit("sameContact", {
            self: self,
            other: other
          });
        }
      }
    });
    cc._RF.pop();
  }, {} ],
  Game: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "8e80dMWyH5LD7Oj100K42f8", "Game");
    "use strict";
    var Fruit = cc.Class({
      name: "FruitItem",
      properties: {
        id: 0,
        iconSF: cc.SpriteFrame
      }
    });
    var JuiceItem = cc.Class({
      name: "JuiceItem",
      properties: {
        particle: cc.SpriteFrame,
        circle: cc.SpriteFrame,
        slash: cc.SpriteFrame
      }
    });
    cc.Class({
      extends: cc.Component,
      properties: {
        fruits: {
          default: [],
          type: Fruit
        },
        juices: {
          default: [],
          type: JuiceItem
        },
        fruitPrefab: {
          default: null,
          type: cc.Prefab
        },
        juicePrefab: {
          default: null,
          type: cc.Prefab
        },
        boomAudio: {
          default: null,
          type: cc.AudioClip
        },
        knockAudio: {
          default: null,
          type: cc.AudioClip
        },
        waterAudio: {
          default: null,
          type: cc.AudioClip
        },
        scoreLabel: {
          default: null,
          type: cc.Label
        },
        fingerBtn: {
          default: null,
          type: cc.Button
        },
        restartBtn: {
          default: null,
          type: cc.Button
        },
        fruitScale: {
          default: 1,
          type: cc.Float
        }
      },
      onLoad: function onLoad() {
        this.initPhysics();
        this.isCreating = false;
        this.fruitCount = 0;
        this.score = 0;
        this.useFinger = false;
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.initOneFruit();
      },
      start: function start() {
        this.fingerBtn.node.on(cc.Node.EventType.TOUCH_START, this.onFingerTouch, this);
        this.restartBtn.node.on(cc.Node.EventType.TOUCH_START, this.onRestartGame, this);
      },
      initPhysics: function initPhysics() {
        var instance = cc.director.getPhysicsManager();
        instance.enabled = true;
        instance.gravity = cc.v2(0, -960);
        var collisionManager = cc.director.getCollisionManager();
        collisionManager.enabled = true;
        var width = this.node.width;
        var height = this.node.height;
        var node = new cc.Node();
        var body = node.addComponent(cc.RigidBody);
        body.type = cc.RigidBodyType.Static;
        node.parent = this.node;
      },
      initOneFruit: function initOneFruit(id) {
        void 0 === id && (id = 1);
        this.fruitCount++;
        this.currentFruit = this.createFruitOnPos(0, 400, id);
      },
      onTouchStart: function onTouchStart(e) {
        var _this = this;
        if (this.isCreating) return;
        this.isCreating = true;
        var _this$node = this.node, width = _this$node.width, height = _this$node.height;
        var fruit = this.currentFruit;
        var pos = e.getLocation();
        var x = pos.x, y = pos.y;
        x -= width / 2;
        y -= height / 2;
        var action = cc.sequence(cc.moveBy(.1, cc.v2(x, 0)).easing(cc.easeCubicActionIn()), cc.callFunc(function() {
          _this.startFruitPhysics(fruit);
          _this.scheduleOnce(function() {
            var nextId = _this.getNextFruitId();
            _this.initOneFruit(nextId);
            _this.isCreating = false;
          }, 1);
        }));
        fruit.runAction(action);
      },
      onFingerTouch: function onFingerTouch() {
        console.log("onFingerTouch");
        this.useFinger = true;
      },
      onRestartGame: function onRestartGame() {
        cc.director.loadScene(cc.director.getScene().name);
      },
      getNextFruitId: function getNextFruitId() {
        return this.fruitCount < 3 ? 1 : 3 === this.fruitCount ? 2 : Math.floor(5 * Math.random()) + 1;
      },
      createOneFruit: function createOneFruit(num) {
        var _this2 = this;
        var fruit = cc.instantiate(this.fruitPrefab);
        var config = this.fruits[num - 1];
        fruit.getComponent("Fruit").init({
          id: config.id,
          iconSF: config.iconSF
        });
        fruit.getComponent(cc.RigidBody).type = cc.RigidBodyType.Static;
        fruit.getComponent(cc.PhysicsCircleCollider).radius = 0;
        this.node.addChild(fruit);
        fruit.scale = this.fruitScale;
        fruit.on("sameContact", this.onSameFruitContact.bind(this));
        fruit.on(cc.Node.EventType.TOUCH_START, function(e) {
          if (_this2.useFinger && fruit !== _this2.currentFruit) {
            var x = fruit.x, y = fruit.y, width = fruit.width;
            _this2.createFruitJuice(config.id, cc.v2({
              x: x,
              y: y
            }), width);
            e.stopPropagation();
            _this2.useFinger = false;
            fruit.removeFromParent(true);
          }
        });
        return fruit;
      },
      startFruitPhysics: function startFruitPhysics(fruit) {
        fruit.getComponent(cc.RigidBody).type = cc.RigidBodyType.Dynamic;
        var physicsCircleCollider = fruit.getComponent(cc.PhysicsCircleCollider);
        physicsCircleCollider.radius = fruit.height / 2;
        physicsCircleCollider.apply();
      },
      createFruitOnPos: function createFruitOnPos(x, y, type) {
        void 0 === type && (type = 1);
        console.log("createFruitOnPos " + y);
        var fruit = this.createOneFruit(type);
        fruit.setPosition(cc.v2(x, y));
        return fruit;
      },
      onSameFruitContact: function onSameFruitContact(_ref) {
        var self = _ref.self, other = _ref.other;
        other.node.off("sameContact");
        var id = other.getComponent("Fruit").id;
        self.node.removeFromParent(true);
        other.node.removeFromParent(true);
        var _other$node = other.node, x = _other$node.x, y = _other$node.y;
        this.createFruitJuice(id, cc.v2({
          x: x,
          y: y
        }), other.node.width);
        this.addScore(id);
        var nextId = id + 1;
        if (nextId <= 11) {
          var newFruit = this.createFruitOnPos(x, y, nextId);
          this.startFruitPhysics(newFruit);
          newFruit.scale = 0;
          cc.tween(newFruit).to(.5, {
            scale: this.fruitScale
          }, {
            easing: "backOut"
          }).start();
        } else console.log(" todo \u5408\u6210\u4e24\u4e2a\u897f\u74dc \u8fd8\u6ca1\u6709\u5b9e\u73b0\u54e6~ ");
      },
      createFruitJuice: function createFruitJuice(id, pos, n) {
        cc.audioEngine.play(this.boomAudio, false, 1);
        cc.audioEngine.play(this.waterAudio, false, 1);
        var juice = cc.instantiate(this.juicePrefab);
        this.node.addChild(juice);
        var config = this.juices[id - 1];
        var instance = juice.getComponent("Juice");
        instance.init(config);
        instance.showJuice(pos, n);
      },
      addScore: function addScore(fruitId) {
        this.score += 2 * fruitId;
        this.scoreLabel.string = this.score;
      }
    });
    cc._RF.pop();
  }, {} ],
  Juice: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "56c1eHSOMxI0L+m6MX8FMXw", "Juice");
    "use strict";
    var RandomInteger = function RandomInteger(e, t) {
      return Math.floor(Math.random() * (t - e) + e);
    };
    cc.Class({
      extends: cc.Component,
      properties: {
        particle: {
          default: null,
          type: cc.SpriteFrame
        },
        circle: {
          default: null,
          type: cc.SpriteFrame
        },
        slash: {
          default: null,
          type: cc.SpriteFrame
        }
      },
      init: function init(data) {
        this.particle = data.particle;
        this.circle = data.particle;
        this.slash = data.slash;
      },
      showJuice: function showJuice(pos, width) {
        var _this = this;
        var _loop = function _loop(i) {
          var node = new cc.Node("Sprite");
          var sp = node.addComponent(cc.Sprite);
          sp.spriteFrame = _this.particle;
          node.parent = _this.node;
          var a = 359 * Math.random(), i = 30 * Math.random() + width / 2, l = cc.v2(Math.sin(a * Math.PI / 180) * i, Math.cos(a * Math.PI / 180) * i);
          node.scale = .5 * Math.random() + width / 100;
          var p = .5 * Math.random();
          node.position = pos;
          node.runAction(cc.sequence(cc.spawn(cc.moveBy(p, l), cc.scaleTo(p + .5, .3), cc.rotateBy(p + .5, RandomInteger(-360, 360))), cc.fadeOut(.1), cc.callFunc(function() {
            node.active = false;
          }, _this)));
        };
        for (var i = 0; i < 10; ++i) _loop(i);
        var _loop2 = function _loop2(f) {
          var node = new cc.Node("Sprite");
          var sp = node.addComponent(cc.Sprite);
          sp.spriteFrame = _this.circle;
          node.parent = _this.node;
          var a = 359 * Math.random(), i = 30 * Math.random() + width / 2, l = cc.v2(Math.sin(a * Math.PI / 180) * i, Math.cos(a * Math.PI / 180) * i);
          node.scale = .5 * Math.random() + width / 100;
          var p = .5 * Math.random();
          node.position = pos;
          node.runAction(cc.sequence(cc.spawn(cc.moveBy(p, l), cc.scaleTo(p + .5, .3)), cc.fadeOut(.1), cc.callFunc(function() {
            node.active = false;
          }, _this)));
        };
        for (var f = 0; f < 20; f++) _loop2(f);
        var node = new cc.Node("Sprite");
        var sp = node.addComponent(cc.Sprite);
        sp.spriteFrame = this.slash;
        node.parent = this.node;
        node.position = pos;
        node.scale = 0;
        node.angle = RandomInteger(0, 360);
        node.runAction(cc.sequence(cc.spawn(cc.scaleTo(.2, width / 150), cc.fadeOut(1)), cc.callFunc(function() {
          node.active = false;
        })));
      }
    });
    cc._RF.pop();
  }, {} ]
}, {}, [ "Fruit", "Game", "Juice" ]);