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
    if (urlParams.get('fig1A')) {
        const fig1A = urlParams.get('fig1A')
        const fig1B = urlParams.get('fig1B')
        const fig2A = urlParams.get('fig2A')
        const fig2B = urlParams.get('fig2B')
        const confidence = urlParams.get('confidence')
        $(".fig-1A:input").val(fig1A)
        $(".fig-1B:input").val(fig1B)
        $(".fig-2A:input").val(fig2A)
        $(".fig-2B:input").val(fig2B)
        $("#sig-val").html(confidence * 100)
        calculate(fig1A, fig1B, fig2A, fig2B, confidence, path);
    }

    // Calculate from Button
    $("form").submit(function (e) {
        e.preventDefault();
        gtag("event", "calculate");
        const fig1A = $(".fig-1A:input").val()
        const fig1B = $(".fig-1B:input").val()
        const fig2A = $(".fig-2A:input").val()
        const fig2B = $(".fig-2B:input").val()
        const confidence = $("#confidenceRange").val() / 100
        calculate(fig1A, fig1B, fig2A, fig2B, confidence, path);
    });

    // Copy Link
    $(".copy-btn").click(function () {
        const copyText = $(".copy-btn").attr("data-copy-link");
        navigator.clipboard.writeText(copyText);
        $(".copy-btn").text("Copied!");
        setTimeout(function () { $(".copy-btn").html("<i class='bi bi-clipboard'></i> Copy calculation link"); }, 2000);
    });

    // Calculate Function
    function calculate(fig1A, fig1B, fig2A, fig2B, confidence, path) {
        update_result(parseInt(fig1A), parseInt(fig1B), parseInt(fig2A), parseInt(fig2B), confidence)
        $(".copy-btn").attr("data-copy-link", "https://growthcalculators.com" + path + "?fig1A=" + fig1A + "&fig1B=" + fig1B + "&fig2A=" + fig2A + "&fig2B=" + fig2B + "&confidence=" + confidence)
        $(".empty-box").remove()
        $(".result-box").show()
    }

    function chi_squared_term(e, o) {
        return (e - o) * (e - o) / e;
    }

    function chi_squared(s1, t1, s2, t2) {
        var test_stat = 0.0;
        var mean_p = (s1 + s2) / (t1 + t2);
        test_stat += chi_squared_term(mean_p * t1, s1);
        test_stat += chi_squared_term((1 - mean_p) * t1, t1 - s1);
        test_stat += chi_squared_term(mean_p * t2, s2);
        test_stat += chi_squared_term((1 - mean_p) * t2, t2 - s2);
        return test_stat;
    }

    function format_number(num, decimals) {
        var sign = "";
        if (num < 0) {
            sign = "-"; // this is not a hyphen-minus
        }
        return sign + Math.abs(round_to_places(num, decimals));
    }

    function round_to_places(num, decimals) {
        var extra_places = 0;
        if (Math.abs(num) < 0.1 && num != 0.0) {
            extra_places = Math.abs(1 + Math.floor(Math.log(Math.abs(num)) / Math.LN10));
        }
        if (extra_places > 6) {
            extra_places = 6;
        }
        return (Math.round(num * Math.pow(10, decimals + extra_places)) /
            Math.pow(10, decimals + extra_places));
    }

    function update_result(fig1A, fig1B, fig2A, fig2B, confidence_level) {
        var chi2 = chi_squared(fig1B, fig1A, fig2B, fig2A);
        var p_value = isNaN(chi2) ? NaN : 1.0 - jstat.pgamma(chi2, 1 / 2, 1 / 2);
        var p_value_decimals = p_value < 0.05 ? 3 : 2;
        var p_val_operator = p_value < 0.001 ? "<" : "=";
        var p_val = p_value < 0.001 ? "0.001" : format_number(p_value, p_value_decimals)
        var a_rate = ((fig1B / fig1A) * 100).toLocaleString(undefined, { 'minimumFractionDigits': 2, 'maximumFractionDigits': 2 })
        var b_rate = ((fig2B / fig2A) * 100).toLocaleString(undefined, { 'minimumFractionDigits': 2, 'maximumFractionDigits': 2 })
        var lift = (((b_rate - a_rate) / a_rate) * 100).toLocaleString(undefined, { 'minimumFractionDigits': 2, 'maximumFractionDigits': 2 })

        function stats(a_rate, b_rate, lift) {
            $("#p_value").html("p value: p" + p_val_operator + p_val)
            $("#a_rate").html("Variant A Rate: " + a_rate + "%")
            $("#b_rate").html("Variant B Rate: " + b_rate + "%")
            $("#lift").html("Lift: " + lift + "%")
            $("#confidence").html("Confidence Level: " + confidence_level * 100 + "%")
        }

        if (p_value < 1.0 - confidence_level) {
            if (fig1B / fig1A > fig2B / fig2A) {
                $("#test_result").html("Results are significant!");
                $("#desc").html("Variant A is more successful than Variant B.");
                stats(a_rate, b_rate, lift);

            } else {
                $("#test_result").html("Results are significant!");
                $("#desc").html("Variant B is more successful than Variant A.");
                stats(a_rate, b_rate, lift);
            }
        } else {
            $("#test_result").html("Not significant");
            $("#desc").html("There is no statistically significant difference between variants.");
            stats(a_rate, b_rate, lift);
        }

    }

});