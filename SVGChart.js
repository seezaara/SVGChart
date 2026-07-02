!function () { 
    const svg_offse_top = 50
    const svg_offse_height = 100
    var styles = '.chartp{--offset:6px;--line:rgba(0, 0, 0, 0.1);--bakcground-value:#333143;--color-value:#fff;--pointer:rgb(128, 136, 255)}.chartp{padding-top:50px;padding-bottom:20px;overflow:hidden;position:relative;width:100%;height:100%;display:flex;flex-direction:row-reverse;box-sizing:border-box}.main_chart{flex:1;position:relative;padding-inline-start:10px;height:calc(100% - 3em)}.chartp .svg_container{margin-top:-' + svg_offse_top + 'px;position:absolute;width:100%;height:calc(100% - var(--offset) + ' + svg_offse_height + 'px)}.svg_container>div>div{width: 100%;height: 100%;position: absolute;}.chartp svg{position:absolute;}.chart{width:100%;height:100%;background-image:linear-gradient(to top,var(--line) 2px,transparent 2px);background-size:100% calc(33.33333% - var(--offset)/ 3);border-top:4px solid transparent;background-position:left top;box-sizing:border-box;display:flex}.chart>div{position:relative;display:flex;width:100%;align-items:flex-end;justify-content:center;padding-top:var(--offset)}.chart>div>span{width:2px;display:block;bottom:0;pointer-events:none;padding-bottom:var(--offset)}.chart>div>span>span{z-index:1;position:absolute;left:50%;transform:translate(-50%,-100%);margin-top:-15px;text-align:center;content:attr(val);white-space:nowrap;padding:5px 7px;background-color:var(--bakcground-value);border-radius:5px;color:var(--color-value)}.chart>div>span>span::before{position:absolute;content:"";width:0;height:0;border-left:6px solid transparent;border-right:6px solid transparent;border-top:6px solid var(--bakcground-value);left:50%;top:100%;transform:translate(-50%,-1px)}.chart>div>span::before{position:absolute;left:50%;transform:translate(-50%,-50%);padding-top:10px;content:"";border-radius:100%;padding:5px;background:var(--pointer)}.chart>div::before{position:absolute;left:50%;transform:translateX(-50%);top:100%;padding-top:10px;text-align:center;content:attr(data-title);display:none;height:1em;padding:8px 20px}.chart>div::after{position:absolute;left:50%;transform:translateX(-50%);top:100%;width:.15em;height:6px;content:"";display:none;background:var(--line)}.chart:hover+div+.chart_dashitem,.chart:hover>div::after{display:none!important}.chart>div:hover::after,.chart>div:hover::before{display:block!important;z-index:10}.chart_dashitem{position:relative;height:calc(100% - 2em);top:-.5em;padding-bottom:var(--offset);display:flex;flex-direction:column-reverse;text-align:end;justify-content:space-between;box-sizing:border-box}'

    // ==================================================  line
    
    function svgPath(list, cp = "", max, command = 0, yOffset = 0) {
        const call = command && command != 0 ? bezierCommand : lineCommand;

        var d = list.reduce(function (acc, point, i, a) {
            const adjustedPoint = [point[0], point[1] + yOffset];
            return i === 0
                ? 'M ' + cp + adjustedPoint[0] + ',' + adjustedPoint[1]
                : acc + ' ' + call(adjustedPoint, max, command, i, a.map(p => [p[0], p[1] + yOffset]));
        }, '');
        return d;
    }


    function lineCommand(point) {
        return 'L ' + point[0] + ' ' + point[1];
    };


    //=============================================== curve line

    function controlPoint(smoothing = .2, max, current, previous, next, reverse) {
        var p = previous || current;
        var n = next || current;
        // The smoothing ratio 
        // Properties of the opposed-line
        var o = line(p, n);
        // If is end-control-point, add PI to the angle to go backward
        var angle = o.angle + (reverse ? Math.PI : 0);
        var length = o.length * .1 * smoothing;
        // The control point position is relative to the current point
        var x = current[0] + Math.cos(angle) * length;
        var y = current[1] + Math.sin(angle) * length;
        if (max > y) {
            return [x, y];
        } else {
            return [current[0], current[1]];
        }
    };


    function line(pointA, pointB) {
        var lengthX = pointB[0] - pointA[0];
        var lengthY = pointB[1] - pointA[1];
        return {
            length: Math.sqrt(Math.pow(lengthX, 2) + Math.pow(lengthY, 2)),
            angle: Math.atan2(lengthY, lengthX)
        };
    };
    function bezierCommand(point, max, smoothing, i, a) {
        // start control point
        var cps = controlPoint(smoothing, max, a[i - 1], a[i - 2], point);
        // end control point
        var cpe = controlPoint(smoothing, max, point, a[i - 1], a[i + 1], true);
        return "C " + cps[0] + "," + cps[1] + " " + cpe[0] + "," + cpe[1] + " " + point[0] + "," + point[1];
    };

    //=============================================== chartlist

    function convert_list_to_svg_point(svg, main_list, max, min) {
        var bound = svg.getBoundingClientRect();
        var offset = (bound.width - 10) / main_list.length;
        var list = [];

        // extend ends
        main_list.unshift(main_list[0]);
        main_list.push(main_list[main_list.length - 1]);

        var range = max - min || 1; // avoid divide-by-zero

        for (var i in main_list) {
            // normalize value to 0–1
            var normalized = (main_list[i] - min) / range;

            // invert for SVG Y (0 = top)
            var y = bound.height - (normalized * (bound.height - 5 - svg_offse_height)) - svg_offse_height + svg_offse_top;
            var x = i * offset - (offset / 2);

            list.push([x, y]);
        }

        // remove extra ends
        main_list.splice(0, 1);
        main_list.splice(main_list.length - 1, 1);

        return list;
    }

    function create_dialog_cahrt(chartp, head) {
        var out2 = ""
        for (var i in head) {
            out2 += '<div data-title="' + head[i] + '" ></div>'
        }
        chartp.children[1].innerHTML = out2
    }

    function add_dialog_cahrt(chartp, head, list, rand, max, min, value_show, range_show) {
        var out = ""
        for (var i in rand) {
            out += "<div>" + (range_show ? range_show(rand[i]) : rand[i]) + "</div>"
        }
        chartp.children[1].innerHTML = out
        // ================================
        for (var i in list) {
            chartp.children[0].children[1].children[i].insertAdjacentHTML("beforeend", '<span style="height:' + Math.max(0, Math.min(((list[i] - min) / (max - min || 1)) * 100, 100)) + '%" ><span>' + (value_show ? value_show(list[i], head[i]) : list[i]) + '</span></span>')
        }
    }
    function get_cahrt_number(f1, max, min) {
        var f2 = Math.pow(10, (max + "").length - 1)
        f1--;
        factor = Math.ceil((max - min) / f1 / f2) * f2
        var out = []
        for (let i = -1; i < f1; i++) {
            out.push(min)
            min += factor
        }
        return out;
    }
    function add_style(element, css, cls = "main") {
        let style;

        if (cls !== undefined) {
            style = element.querySelector('style.' + cls);

            if (!style) {
                style = document.createElement('style');
                style.classList.add(cls);
                element.appendChild(style);
            }
        } else {
            style = document.createElement('style');
            element.appendChild(style);
        }

        if (style.styleSheet) {
            style.styleSheet.cssText += css;
        } else {
            style.appendChild(document.createTextNode(css));
        }
    }


    //=============================================== create

    function setup_svg(svg, option, svg_points) {
        if (option.line) {
            const maxw = (svg_points[svg_points.length - 1][0] + 100);
            const height = svg.getBoundingClientRect().height - svg_offse_height + svg_offse_top + 9;
            const wdith = option.line.width || 2
            const clipPath = option.clip
                ? `style="clip-path:path('${svgPath(
                    svg_points,
                    option.clip >= 0 ? `${maxw},-${wdith} -${wdith},-${wdith}` : `${maxw},${maxw - wdith} -${wdith},${maxw}`
                    , height, option.line.curve, 0)}')"`
                : "";



            svg.insertAdjacentHTML("beforeend",
                `<div>
                    <div ${clipPath}></div>
                    <svg width="100%" height="100%" preserveAspectRatio="none">
                        <path 
                        d="${svgPath(svg_points, "", height, option.line.curve)}"
                        fill="none"
                        style="${option.line.style || ""}"
                        stroke-width="${wdith}"
                        stroke="${option.line.color || "#78c9f3bf"}"
                        stroke-linejoin="round"
                        stroke-linecap="round"
                        />
                    </svg>
                </div>`
            );


        }
    }
    window.Chart = function (element, head, opt = {}) {
        var refresh_save = []
        var lastmax = 0
        var lastmin = 0
        var chart_numbers = []

        element = shadow(element);
        element.innerHTML = '<div class="chartp"><div class="main_chart"><div class="svg_container"></div><div class="chart"></div></div><div class="chart_dashitem"></div></div><style>' + styles + '</style>'
        var chartp = element.children[0];
        var main_chart = chartp.children[0];
        var svg = main_chart.children[0];
        create_dialog_cahrt(main_chart, head)
        // ================================================ styles 
        if (opt.style)
            add_style(element, opt.style);
        add_style(element, '.chart div' + (opt.hide ? ":nth-child" + opt.hide : "") + '::before,.chart div' + (opt.hide ? ":nth-child" + opt.hide : "") + '::after{display:block;}');

        if (window.getComputedStyle(main_chart.children[1], null).getPropertyValue("direction") == "rtl")
            add_style(element, '.chartp svg {-moz-transform: scale(-1, 1);-o-transform: scale(-1, 1);-webkit-transform: scale(-1, 1);transform: scale(-1, 1);}');

        // ================================================   width change event
        var firstcall = true;
        new ResizeObserver(function () {
            if (firstcall) {
                firstcall = false
                return
            }
            refresh(false)
        }).observe(element.children[0]);

        function add(option) {
            var ind = refresh_save.length 
            if (option.list && option.list.length == head.length) {
                const cssindex = ind + 1
                // ================================================ styles
                if (option.pointer)
                    add_style(element, '.chart>div>span:nth-child(' + cssindex + '){' + option.pointer + '}', "st" + ind);
                if (option.pointer_hover)
                    add_style(element, '.chart>div:hover>span:nth-child(' + cssindex + '){' + option.pointer_hover + '}', "st" + ind);
                if (option.value)
                    add_style(element, '.chart>div>span:nth-child(' + cssindex + ')>span{' + option.value + '}', "st" + ind);
                if (option.value_hover)
                    add_style(element, '.chart>div:hover>span:nth-child(' + cssindex + ')>span{' + option.value_hover + '}', "st" + ind);
                if (option.spot)
                    add_style(element, '.chart>div>span:nth-child(' + cssindex + ')::before{' + option.spot + '}', "st" + ind);
                if (option.spot_hover)
                    add_style(element, '.chart>div:hover>span:nth-child(' + cssindex + ')::before{' + option.spot_hover + '}', "st" + ind);

                if (option.clip_style)
                    add_style(element, '.main_chart>.svg_container>div:nth-child(' + cssindex + ')>div{' + option.clip_style + '}', "st" + ind);



                var rand = get_cahrt_number(4, Math.max(...option.list, lastmax), Math.min(...option.list, lastmin))
                var hold_max = Math.max(...rand, lastmax)
                var hold_min = Math.min(...rand, lastmin)
                if (hold_max > lastmax) {
                    lastmax = hold_max
                }
                if (hold_min < lastmin) {
                    lastmin = hold_min
                }
                chart_numbers = rand


                refresh_save.push(option)
                refresh()
            } else {
                console.error("list error: list " + option.list.length + " - head " + head.length)
            }
        }
        function remove(i = -1) {
            if (i == -1) {
                refresh_save = []
                element.querySelectorAll('[class^="st"]').forEach(el => el.remove());
            } else {
                refresh_save.splice(i, 1)
                element.querySelector('.st' + i).remove()
            }
            lastmax = 0
            lastmin = 0
            chart_numbers = []
            refresh()
        }
        function refresh(is = true) {
            svg.innerHTML = ""
            if (is === true)
                create_dialog_cahrt(main_chart, head)
            for (var item of refresh_save) {
                if (is === true) {
                    add_dialog_cahrt(chartp, head, item.list, chart_numbers, lastmax, lastmin, item.value_show, opt.range)
                }
                setup_svg(svg, item, convert_list_to_svg_point(svg, item.list, lastmax, lastmin))
            }
        }
        return {
            add: add,
            remove: remove,
            refresh: refresh,
        };
    }
    function shadow(element) {
        if (typeof element.attachShadow != "undefined") {
            return element.attachShadow({ mode: 'closed' })
        } else {
            return element.createShadowRoot();
        }
    }
}();

