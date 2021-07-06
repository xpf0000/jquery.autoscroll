(function ($) {
    let methods = {
        init: function (options) {
            let p = {
                direction: 'left',
                speed: 0.5,
                runshort: true,
                hoverstop: true,
            }
            if (options) {
                $.extend(p, options)
            }
            let enterEvent = 'mouseenter'
            let leaveEvent = 'mouseleave'
            let
                container = $(this),
                strWrap = container.children('.auto-scroll-wapper')

            const code = function () {
                container.off(enterEvent);
                container.off(leaveEvent);
                container.find('.autoScroll-clone').remove()
                strWrap.data('currentMove', null)

                let wapperValue = 0, innerValue = 0

                if (p.direction === 'left' || p.direction === 'right') {
                    wapperValue = container.width()
                    innerValue = strWrap.outerWidth(true)
                } else {
                    wapperValue = container.height()
                    innerValue = strWrap.outerHeight(true)
                }

                if (wapperValue >= innerValue && !p.runshort) {
                    return
                }
                let clone
                if (wapperValue < innerValue) {
                    clone = strWrap.clone(false).addClass('autoScroll-clone')
                    container.append(clone)
                }
                const move = function () {
                    strWrap.timer && cancelAnimationFrame(strWrap.timer)
                    strWrap.timer = null
                    let pos = 0
                    if (p.direction === 'up' || p.direction === 'left') {
                        pos = strWrap.data('currentMove') || 0;
                        pos -= p.speed
                        if(pos < 0 && Math.abs(pos) >= innerValue) {
                            if (wapperValue < innerValue) {
                                pos = Math.abs(pos) - innerValue
                            } else {
                                pos = wapperValue
                            }
                        }
                    } else {
                        if (wapperValue < innerValue) {
                            pos = strWrap.data('currentMove') || -innerValue;
                            pos += p.speed
                            if(pos >= 0) {
                                pos = -innerValue + pos
                            }
                        } else {
                            pos = strWrap.data('currentMove') || 0;
                            pos += p.speed
                            if(pos >= wapperValue) {
                                pos = pos - wapperValue
                            }
                        }
                    }
                    strWrap.data('currentMove',pos)
                    const transform = (p.direction === 'left' || p.direction === 'right') ? `translateX(${pos}px)` : `translateY(${pos}px)`
                    strWrap.css({
                        transform: transform
                    })
                    clone && clone.css({
                        transform: transform
                    })
                    strWrap.timer = requestAnimationFrame(move)
                }
                strWrap.move = move
                move()
                if (p.hoverstop) {
                    container.on(enterEvent, function () {
                        if (strWrap.isPause) return
                        strWrap.timer && cancelAnimationFrame(strWrap.timer)
                        strWrap.timer = null
                    }).on(leaveEvent, function () {
                        if (strWrap.isPause) return
                        strWrap.move && strWrap.move()
                    })
                }
                strWrap.isDestroy = false
                strWrap.isPause = false
            }
            code()
            const update = function (opt) {
                if (opt) {
                    $.extend(p, opt)
                }
                code()
            }
            const destroy = function () {
                strWrap.timer && cancelAnimationFrame(strWrap.timer)
                strWrap.timer = null
                container.off(enterEvent);
                container.off(leaveEvent);
                container.find('.autoScroll-clone').remove()
                strWrap.data('currentMove', null)
                strWrap.css({
                    transform: ''
                })
                strWrap.isPause = false
                strWrap.isDestroy = true
            }
            const pause = function () {
                if (strWrap.isDestroy) {
                    console.warn('autoScroll object has destroyed')
                    return
                }
                strWrap.timer && cancelAnimationFrame(strWrap.timer)
                strWrap.timer = null
                strWrap.isPause = true
            }
            const play = function () {
                if (strWrap.isDestroy) {
                    console.warn('autoScroll object has destroyed')
                    return
                }
                strWrap.isPause = false
                strWrap.move && strWrap.move()
            }

            return {
                update:update,
                destroy: destroy,
                pause: pause,
                play: play
            }
        },
    };
    $.fn.autoScroll = function (method) {
        if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments)
        } else {
            console.log('autoScroll is not found')
        }
    }
})(jQuery)
