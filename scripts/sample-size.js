// Significance Slider
function significance(x) {
    $("#sig-val").text(x)
}

$(document).ready(function () {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

    const queryString = window.location.search;
    const path = window.location.pathname;
    const urlParams = new URLSearchParams(queryString);

    // Calcuate from URL
    if (urlParams.get('fig1')) {
        const fig1 = parseFloat(urlParams.get('fig1'))
        const fig2 = parseFloat(urlParams.get('fig2'))
        const fig3 = urlParams.get('fig3')
        $(".fig-1:input").val(fig1 * 100)
        $(".fig-2:input").val(fig2 * 100)
        $("#sig-val").html((1 - fig3) * 100)
        calculate(fig1, fig2, fig3, path);
    }

    // Calculate from Button
    $("form").submit(function (e) {
        e.preventDefault();
        gtag("event", "calculate");
        const fig1 = $(".fig-1:input").val() / 100
        const fig2 = $(".fig-2:input").val() / 100
        const fig3 = 1 - ($(".fig-3:input").val() / 100)
        calculate(fig1, fig2, fig3, path);
    });

    // Copy Link
    $(".copy-btn").click(function () {
        const copyText = $(".copy-btn").attr("data-copy-link");
        navigator.clipboard.writeText(copyText);
        $(".copy-btn").text("Copied!");
        setTimeout(function () { $(".copy-btn").html("<i class='bi bi-clipboard'></i> Copy calculation link"); }, 2000);
    });

    // Calculate Function
    function calculate(fig1, fig2, fig3, path) {
        const p = fig2 * fig1
        const result = getSampleSize(fig3, 0.80, fig1, p)
        $(".copy-btn").attr("data-copy-link", "https://growthcalculators.com" + path + "?fig1=" + fig1 + "&fig2=" + fig2 + "&fig3=" + fig3)
        $(".empty-box").remove()
        $(".result-box").show()
        $(".result").text(Math.round(result).toLocaleString() + " Per Variant")
    }

    // Calculate Sample Size
    function getSampleSize(alpha, power_level, p, delta) {
        if (p > 0.5) {
            p = 1.0 - p;
        }
        var t_alpha2 = ppnd(1.0 - alpha / 2);
        var t_beta = ppnd(power_level);

        var sd1 = Math.sqrt(2 * p * (1.0 - p));
        var sd2 = Math.sqrt(p * (1.0 - p) + (p + delta) * (1.0 - p - delta));
        return (t_alpha2 * sd1 + t_beta * sd2) * (t_alpha2 * sd1 + t_beta * sd2) / (delta * delta);
    }

    function ppnd(p) {
        var a0 = 2.50662823884;
        var a1 = -18.61500062529;
        var a2 = 41.39119773534;
        var a3 = -25.44106049637;
        var b1 = -8.47351093090;
        var b2 = 23.08336743743;
        var b3 = -21.06224101826;
        var b4 = 3.13082909833;
        var c0 = -2.78718931138;
        var c1 = -2.29796479134;
        var c2 = 4.85014127135;
        var c3 = 2.32121276858;
        var d1 = 3.54388924762;
        var d2 = 1.63706781897;
        var r;
        var split = 0.42;
        var value;

        /*
           0.08 < P < 0.92
           */
        if (Math.abs(p - 0.5) <= split) {
            r = (p - 0.5) * (p - 0.5);

            value = (p - 0.5) * (((
                a3 * r
                + a2) * r
                + a1) * r
                + a0) / ((((
                    b4 * r
                    + b3) * r
                    + b2) * r
                    + b1) * r
                    + 1.0);
        }
        /*
           P < 0.08 or P > 0.92,
           R = min ( P, 1-P )
           */
        else if (0.0 < p && p < 1.0) {
            if (0.5 < p) {
                r = Math.sqrt(- Math.log(1.0 - p));
            } else {
                r = Math.sqrt(- Math.log(p));
            }

            value = (((
                c3 * r
                + c2) * r
                + c1) * r
                + c0) / ((
                    d2 * r
                    + d1) * r
                    + 1.0);

            if (p < 0.5) {
                value = - value;
            }
        }
        /*
           P <= 0.0 or 1.0 <= P
           */
        else {
            value = NaN;
        }

        return value;
    }

});