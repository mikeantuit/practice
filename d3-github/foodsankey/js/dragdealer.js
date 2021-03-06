(function(e, t) {
    if (typeof define === "function" && define.amd) {
        define(t)
    } else {
        e.Dragdealer = t()
    }
})(this, function() {
    function f(e) {
        var t = "Webkit Moz ms O".split(" ")
          , n = document.documentElement.style;
        if (n[e] !== undefined)
            return e;
        e = e.charAt(0).toUpperCase() + e.substr(1);
        for (var r = 0; r < t.length; r++) {
            if (n[t[r] + e] !== undefined) {
                return t[r] + e
            }
        }
    }
    function l(e) {
        if (a.backfaceVisibility && a.perspective) {
            e.style[a.perspective] = "1000px";
            e.style[a.backfaceVisibility] = "hidden"
        }
    }
    var e = function(e, t) {
        this.bindMethods();
        this.options = this.applyDefaults(t || {});
        this.wrapper = this.getWrapperElement(e);
        if (!this.wrapper) {
            return
        }
        this.handle = this.getHandleElement(this.wrapper, this.options.handleClass);
        if (!this.handle) {
            return
        }
        this.init();
        this.bindEventListeners()
    };
    e.prototype = {
        defaults: {
            disabled: false,
            horizontal: true,
            vertical: false,
            slide: true,
            steps: 0,
            snap: false,
            loose: false,
            speed: .1,
            xPrecision: 0,
            yPrecision: 0,
            handleClass: "handle",
            css3: true,
            activeClass: "active"
        },
        init: function() {
            if (this.options.css3) {
                l(this.handle)
            }
            this.value = {
                prev: [-1, -1],
                current: [this.options.x || 0, this.options.y || 0],
                target: [this.options.x || 0, this.options.y || 0]
            };
            this.offset = {
                wrapper: [0, 0],
                mouse: [0, 0],
                prev: [-999999, -999999],
                current: [0, 0],
                target: [0, 0]
            };
            this.change = [0, 0];
            this.stepRatios = this.calculateStepRatios();
            this.activity = false;
            this.dragging = false;
            this.tapping = false;
            this.reflow();
            if (this.options.disabled) {
                this.disable()
            }
        },
        applyDefaults: function(e) {
            for (var t in this.defaults) {
                if (!e.hasOwnProperty(t)) {
                    e[t] = this.defaults[t]
                }
            }
            return e
        },
        getWrapperElement: function(e) {
            if (typeof e == "string") {
                return document.getElementById(e)
            } else {
                return e
            }
        },
        getHandleElement: function(e, t) {
            var n, r, i;
            if (e.getElementsByClassName) {
                n = e.getElementsByClassName(t);
                if (n.length > 0) {
                    return n[0]
                }
            } else {
                r = new RegExp("(^|\\s)" + t + "(\\s|$)");
                n = e.getElementsByTagName("*");
                for (i = 0; i < n.length; i++) {
                    if (r.test(n[i].className)) {
                        return n[i]
                    }
                }
            }
        },
        calculateStepRatios: function() {
            var e = [];
            if (this.options.steps > 1) {
                for (var t = 0; t <= this.options.steps - 1; t++) {
                    e[t] = t / (this.options.steps - 1)
                }
            }
            return e
        },
        setWrapperOffset: function() {
            this.offset.wrapper = u.get(this.wrapper)
        },
        calculateBounds: function() {
            var e = {
                top: this.options.top || 0,
                bottom: -(this.options.bottom || 0) + this.wrapper.offsetHeight,
                left: this.options.left || 0,
                right: -(this.options.right || 0) + this.wrapper.offsetWidth
            };
            e.availWidth = e.right - e.left - this.handle.offsetWidth;
            e.availHeight = e.bottom - e.top - this.handle.offsetHeight;
            return e
        },
        calculateValuePrecision: function() {
            var e = this.options.xPrecision || Math.abs(this.bounds.availWidth)
              , t = this.options.yPrecision || Math.abs(this.bounds.availHeight);
            return [e ? 1 / e : 0, t ? 1 / t : 0]
        },
        bindMethods: function() {
            this.onHandleMouseDown = t(this.onHandleMouseDown, this);
            this.onHandleTouchStart = t(this.onHandleTouchStart, this);
            this.onDocumentMouseMove = t(this.onDocumentMouseMove, this);
            this.onWrapperTouchMove = t(this.onWrapperTouchMove, this);
            this.onWrapperMouseDown = t(this.onWrapperMouseDown, this);
            this.onWrapperTouchStart = t(this.onWrapperTouchStart, this);
            this.onDocumentMouseUp = t(this.onDocumentMouseUp, this);
            this.onDocumentTouchEnd = t(this.onDocumentTouchEnd, this);
            this.onHandleClick = t(this.onHandleClick, this);
            this.onWindowResize = t(this.onWindowResize, this)
        },
        bindEventListeners: function() {
            n(this.handle, "mousedown", this.onHandleMouseDown);
            n(this.handle, "touchstart", this.onHandleTouchStart);
            n(document, "mousemove", this.onDocumentMouseMove);
            n(this.wrapper, "touchmove", this.onWrapperTouchMove);
            n(this.wrapper, "mousedown", this.onWrapperMouseDown);
            n(this.wrapper, "touchstart", this.onWrapperTouchStart);
            n(document, "mouseup", this.onDocumentMouseUp);
            n(document, "touchend", this.onDocumentTouchEnd);
            n(this.handle, "click", this.onHandleClick);
            n(window, "resize", this.onWindowResize);
            var e = this;
            this.interval = setInterval(function() {
                e.animate()
            }, 25);
            this.animate(false, true)
        },
        unbindEventListeners: function() {
            r(this.handle, "mousedown", this.onHandleMouseDown);
            r(this.handle, "touchstart", this.onHandleTouchStart);
            r(document, "mousemove", this.onDocumentMouseMove);
            r(this.wrapper, "touchmove", this.onWrapperTouchMove);
            r(this.wrapper, "mousedown", this.onWrapperMouseDown);
            r(this.wrapper, "touchstart", this.onWrapperTouchStart);
            r(document, "mouseup", this.onDocumentMouseUp);
            r(document, "touchend", this.onDocumentTouchEnd);
            r(this.handle, "click", this.onHandleClick);
            r(window, "resize", this.onWindowResize);
            clearInterval(this.interval)
        },
        onHandleMouseDown: function(e) {
            o.refresh(e);
            i(e);
            s(e);
            this.activity = false;
            this.startDrag()
        },
        onHandleTouchStart: function(e) {
            o.refresh(e);
            s(e);
            this.activity = false;
            this.startDrag()
        },
        onDocumentMouseMove: function(e) {
            o.refresh(e);
            if (this.dragging) {
                this.activity = true
            }
        },
        onWrapperTouchMove: function(e) {
            o.refresh(e);
            if (!this.activity && this.draggingOnDisabledAxis()) {
                if (this.dragging) {
                    this.stopDrag()
                }
                return
            }
            i(e);
            this.activity = true
        },
        onWrapperMouseDown: function(e) {
            o.refresh(e);
            i(e);
            this.startTap()
        },
        onWrapperTouchStart: function(e) {
            o.refresh(e);
            i(e);
            this.startTap()
        },
        onDocumentMouseUp: function(e) {
            this.stopDrag();
            this.stopTap()
        },
        onDocumentTouchEnd: function(e) {
            this.stopDrag();
            this.stopTap()
        },
        onHandleClick: function(e) {
            if (this.activity) {
                i(e);
                s(e)
            }
        },
        onWindowResize: function(e) {
            this.reflow()
        },
        enable: function() {
            this.disabled = false;
            this.handle.className = this.handle.className.replace(/\s?disabled/g, "")
        },
        disable: function() {
            this.disabled = true;
            this.handle.className += " disabled"
        },
        reflow: function() {
            this.setWrapperOffset();
            this.bounds = this.calculateBounds();
            this.valuePrecision = this.calculateValuePrecision();
            this.updateOffsetFromValue()
        },
        getStep: function() {
            return [this.getStepNumber(this.value.target[0]), this.getStepNumber(this.value.target[1])]
        },
        getValue: function() {
            return this.value.target
        },
        setStep: function(e, t, n) {
            this.setValue(this.options.steps && e > 1 ? (e - 1) / (this.options.steps - 1) : 0, this.options.steps && t > 1 ? (t - 1) / (this.options.steps - 1) : 0, n)
        },
        setValue: function(e, t, n) {
            this.setTargetValue([e, t || 0]);
            if (n) {
                this.groupCopy(this.value.current, this.value.target);
                this.updateOffsetFromValue();
                this.callAnimationCallback()
            }
        },
        startTap: function() {
            if (this.disabled) {
                return
            }
            this.tapping = true;
            this.setWrapperOffset();
            this.setTargetValueByOffset([o.x - this.offset.wrapper[0] - this.handle.offsetWidth / 2, o.y - this.offset.wrapper[1] - this.handle.offsetHeight / 2])
        },
        stopTap: function() {
            if (this.disabled || !this.tapping) {
                return
            }
            this.tapping = false;
            this.setTargetValue(this.value.current)
        },
        startDrag: function() {
            if (this.disabled) {
                return
            }
            this.dragging = true;
            this.setWrapperOffset();
            this.offset.mouse = [o.x - u.get(this.handle)[0], o.y - u.get(this.handle)[1]];
            if (!this.wrapper.className.match(this.options.activeClass)) {
                this.wrapper.className += " " + this.options.activeClass
            }
        },
        stopDrag: function() {
            if (this.disabled || !this.dragging) {
                return
            }
            this.dragging = false;
            var e = this.groupClone(this.value.current);
            if (this.options.slide) {
                var t = this.change;
                e[0] += t[0] * 4;
                e[1] += t[1] * 4
            }
            this.setTargetValue(e);
            this.wrapper.className = this.wrapper.className.replace(" " + this.options.activeClass, "")
        },
        callAnimationCallback: function() {
            var e = this.value.current;
            if (this.options.snap && this.options.steps > 1) {
                e = this.getClosestSteps(e)
            }
            if (!this.groupCompare(e, this.value.prev)) {
                if (typeof this.options.animationCallback == "function") {
                    this.options.animationCallback.call(this, e[0], e[1])
                }
                this.groupCopy(this.value.prev, e)
            }
        },
        callTargetCallback: function() {
            if (typeof this.options.callback == "function") {
                this.options.callback.call(this, this.value.target[0], this.value.target[1])
            }
        },
        animate: function(e, t) {
            if (e && !this.dragging) {
                return
            }
            if (this.dragging) {
                var n = this.groupClone(this.value.target);
                var r = [o.x - this.offset.wrapper[0] - this.offset.mouse[0], o.y - this.offset.wrapper[1] - this.offset.mouse[1]];
                this.setTargetValueByOffset(r, this.options.loose);
                this.change = [this.value.target[0] - n[0], this.value.target[1] - n[1]]
            }
            if (this.dragging || t) {
                this.groupCopy(this.value.current, this.value.target)
            }
            if (this.dragging || this.glide() || t) {
                this.updateOffsetFromValue();
                this.callAnimationCallback()
            }
        },
        glide: function() {
            var e = [this.value.target[0] - this.value.current[0], this.value.target[1] - this.value.current[1]];
            if (!e[0] && !e[1]) {
                return false
            }
            if (Math.abs(e[0]) > this.valuePrecision[0] || Math.abs(e[1]) > this.valuePrecision[1]) {
                this.value.current[0] += e[0] * this.options.speed;
                this.value.current[1] += e[1] * this.options.speed
            } else {
                this.groupCopy(this.value.current, this.value.target)
            }
            return true
        },
        updateOffsetFromValue: function() {
            if (!this.options.snap) {
                this.offset.current = this.getOffsetsByRatios(this.value.current)
            } else {
                this.offset.current = this.getOffsetsByRatios(this.getClosestSteps(this.value.current))
            }
            if (!this.groupCompare(this.offset.current, this.offset.prev)) {
                this.renderHandlePosition();
                this.groupCopy(this.offset.prev, this.offset.current)
            }
        },
        renderHandlePosition: function() {
            var e = "";
            if (this.options.css3 && a.transform) {
                if (this.options.horizontal) {
                    e += "translateX(" + this.offset.current[0] + "px)"
                }
                if (this.options.vertical) {
                    e += " translateY(" + this.offset.current[1] + "px)"
                }
                this.handle.style[a.transform] = e;
                return
            }
            if (this.options.horizontal) {
                this.handle.style.left = this.offset.current[0] + "px"
            }
            if (this.options.vertical) {
                this.handle.style.top = this.offset.current[1] + "px"
            }
        },
        setTargetValue: function(e, t) {
            var n = t ? this.getLooseValue(e) : this.getProperValue(e);
            this.groupCopy(this.value.target, n);
            this.offset.target = this.getOffsetsByRatios(n);
            this.callTargetCallback()
        },
        setTargetValueByOffset: function(e, t) {
            var n = this.getRatiosByOffsets(e);
            var r = t ? this.getLooseValue(n) : this.getProperValue(n);
            this.groupCopy(this.value.target, r);
            this.offset.target = this.getOffsetsByRatios(r)
        },
        getLooseValue: function(e) {
            var t = this.getProperValue(e);
            return [t[0] + (e[0] - t[0]) / 4, t[1] + (e[1] - t[1]) / 4]
        },
        getProperValue: function(e) {
            var t = this.groupClone(e);
            t[0] = Math.max(t[0], 0);
            t[1] = Math.max(t[1], 0);
            t[0] = Math.min(t[0], 1);
            t[1] = Math.min(t[1], 1);
            if (!this.dragging && !this.tapping || this.options.snap) {
                if (this.options.steps > 1) {
                    t = this.getClosestSteps(t)
                }
            }
            return t
        },
        getRatiosByOffsets: function(e) {
            return [this.getRatioByOffset(e[0], this.bounds.availWidth, this.bounds.left), this.getRatioByOffset(e[1], this.bounds.availHeight, this.bounds.top)]
        },
        getRatioByOffset: function(e, t, n) {
            return t ? (e - n) / t : 0
        },
        getOffsetsByRatios: function(e) {
            return [this.getOffsetByRatio(e[0], this.bounds.availWidth, this.bounds.left), this.getOffsetByRatio(e[1], this.bounds.availHeight, this.bounds.top)]
        },
        getOffsetByRatio: function(e, t, n) {
            return Math.round(e * t) + n
        },
        getStepNumber: function(e) {
            return this.getClosestStep(e) * (this.options.steps - 1) + 1
        },
        getClosestSteps: function(e) {
            return [this.getClosestStep(e[0]), this.getClosestStep(e[1])]
        },
        getClosestStep: function(e) {
            var t = 0;
            var n = 1;
            for (var r = 0; r <= this.options.steps - 1; r++) {
                if (Math.abs(this.stepRatios[r] - e) < n) {
                    n = Math.abs(this.stepRatios[r] - e);
                    t = r
                }
            }
            return this.stepRatios[t]
        },
        groupCompare: function(e, t) {
            return e[0] == t[0] && e[1] == t[1]
        },
        groupCopy: function(e, t) {
            e[0] = t[0];
            e[1] = t[1]
        },
        groupClone: function(e) {
            return [e[0], e[1]]
        },
        draggingOnDisabledAxis: function() {
            return !this.options.horizontal && o.xDiff > o.yDiff || !this.options.vertical && o.yDiff > o.xDiff
        }
    };
    var t = function(e, t) {
        return function() {
            return e.apply(t, arguments)
        }
    };
    var n = function(e, t, n) {
        if (e.addEventListener) {
            e.addEventListener(t, n, false)
        } else if (e.attachEvent) {
            e.attachEvent("on" + t, n)
        }
    };
    var r = function(e, t, n) {
        if (e.removeEventListener) {
            e.removeEventListener(t, n, false)
        } else if (e.detachEvent) {
            e.detachEvent("on" + t, n)
        }
    };
    var i = function(e) {
        if (!e) {
            e = window.event
        }
        if (e.preventDefault) {
            e.preventDefault()
        }
        e.returnValue = false
    };
    var s = function(e) {
        if (!e) {
            e = window.event
        }
        if (e.stopPropagation) {
            e.stopPropagation()
        }
        e.cancelBubble = true
    };
    var o = {
        x: 0,
        y: 0,
        xDiff: 0,
        yDiff: 0,
        refresh: function(e) {
            if (!e) {
                e = window.event
            }
            if (e.type == "mousemove") {
                this.set(e)
            } else if (e.touches) {
                this.set(e.touches[0])
            }
        },
        set: function(e) {
            var t = this.x
              , n = this.y;
            if (e.clientX || e.clientY) {
                this.x = e.clientX;
                this.y = e.clientY
            } else if (e.pageX || e.pageY) {
                this.x = e.pageX - document.body.scrollLeft - document.documentElement.scrollLeft;
                this.y = e.pageY - document.body.scrollTop - document.documentElement.scrollTop
            }
            this.xDiff = Math.abs(this.x - t);
            this.yDiff = Math.abs(this.y - n)
        }
    };
    var u = {
        get: function(e) {
            var t = {
                left: 0,
                top: 0
            };
            if (e.getBoundingClientRect !== undefined) {
                t = e.getBoundingClientRect()
            }
            return [t.left, t.top]
        }
    };
    var a = {
        transform: f("transform"),
        perspective: f("perspective"),
        backfaceVisibility: f("backfaceVisibility")
    };
    return e
})
