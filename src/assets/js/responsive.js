function resize(window, document) {
    function resize() {
        var ww = window.innerWidth
        if (ww > window.screen.width) {
            window.requestAnimationFrame(resize)
        } else {
            if (ww > 750) {
                ww = 750
            }
            let base = (ww * 32) / 750 //基准宽度375px 字体大小16px
            console.log('base: ' + base)
            document.documentElement.style.fontSize = base + 'px'

            try {
                window.baseFontSize = base
            } catch (error) {}
        }
    }

    resize()

    window.addEventListener('resize', resize)
}

resize(window, document)
