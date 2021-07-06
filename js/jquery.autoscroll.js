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
                strWrap = $(this)
                    .children('.auto-scroll-wapper')
                    .data({speed:p.speed})
                    .addClass(`auto-scroll-${p.direction}`)

            const code = function () {

                strWrap.off('enterEvent');
                strWrap.off('leaveEvent');
                strWrap.find('.autoScroll-clone').remove()
                strWrap.data('currentMove', null)

                let wapperValue = 0, innerValue = 0
                if (p.direction === 'left' || p.direction === 'right') {
                    wapperValue = container.width()
                    strWrap.children().each(function () {
                        innerValue += $(this).outerWidth(true)
                    })
                } else {
                    wapperValue = container.height()
                    strWrap.children().each(function () {
                        innerValue += $(this).outerHeight(true)
                    })
                }
                if (wapperValue >= innerValue && !p.runshort) {
                    return
                }
                if (wapperValue < innerValue) {
                    strWrap.children().each(function () {
                        let clone = $(this).clone(false).addClass('autoScroll-clone')
                        strWrap.append(clone)
                    })
                }
                const move = () => {
                    strWrap.timer && cancelAnimationFrame(strWrap.timer)
                    strWrap.timer = null
                    let pos = 0
                    if (p.direction === 'up' || p.direction === 'left') {
                        pos = strWrap.data('currentMove') || 0;
                        pos -= strWrap.data('speed')
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
                            pos += strWrap.data('speed')
                            if(pos >= 0) {
                                pos = -innerValue + pos
                            }
                        } else {
                            pos = strWrap.data('currentMove') || 0;
                            pos += strWrap.data('speed')
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
                    strWrap.timer = requestAnimationFrame(move)
                }
                strWrap.move = move
                move()
                if (p.hoverstop) {
                    strWrap.on(enterEvent, function () {
                        if (strWrap.isPause) return
                        strWrap.timer && cancelAnimationFrame(strWrap.timer)
                        strWrap.timer = null
                    }).on(leaveEvent, function () {
                        if (strWrap.isPause) return
                        move()
                        container.off('mousemove').off('mouseup')
                    })
                }
            }
            code()
            const update = function () {
                if (!strWrap) {
                    console.warn('autoScroll object has destroyed')
                    return
                }
                code()
            }
            const destroy = function () {
                if (!strWrap) {
                    console.warn('autoScroll object has destroyed')
                    return
                }
                strWrap.timer && cancelAnimationFrame(strWrap.timer)
                strWrap.timer = null
                strWrap.off(enterEvent);
                strWrap.off(leaveEvent);
                strWrap.find('.autoScroll-clone').remove()
                strWrap.data('currentMove', null)
                strWrap.css({
                    transform: ''
                })
                strWrap.removeData()
                strWrap = null
            }
            const pause = function () {
                if (!strWrap) {
                    console.warn('autoScroll object has destroyed')
                    return
                }
                strWrap.timer && cancelAnimationFrame(strWrap.timer)
                strWrap.timer = null
                strWrap.isPause = true
            }
            const play = function () {
                if (!strWrap) {
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
