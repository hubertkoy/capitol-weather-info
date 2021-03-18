$(window).on('load', function () {
    if ($('#preloader').length) {
        $('#preloader').delay(100).fadeOut('slow', function () {
            $(this).remove();
        });
    }
});

$((events, handler) => {
    $('#error').hide();
    $.getJSON('https://secure.geonames.org/countryInfoJSON?formatted=true&lang=en&style=full&username=hubertkoy', (data) => {
        // create empty array
        const cities = [];
        // check countries for capital empty name
        for (let i = 0; i < data.geonames.length; i++) {
            let name = data.geonames[i].capital;
            if (name !== "") {
                cities.push(name);
            }
        }
        // sort cities list
        cities.sort();
        // append select options to #cities
        for (let i = 0; i < cities.length; i++) {
            if (cities[i] === "London") {
                $('#cities').append(`<option value=${cities[i]} selected>${cities[i]}</option>`);
            } else {
                $('#cities').append(`<option value=${cities[i]}>${cities[i]}</option>`);
            }
        }
    }).fail((jqxhr, textStatus, error) => {
        let err = `${textStatus}, ${error}`;
        $('#errorInfo').text(`Couldn't load countries list: ${err}. Try again later.`);
    });
    const getInfo = () => {
        let selCity = $('#cities').val();
        if (!selCity) {
            selCity = 'London';
        }
        $.ajax({
            url: "php/getWeatherInfo.php",
            type: 'POST',
            dataType: "json",
            data: {
                city: selCity
            },
            success: (result) => {
                if (result.status.name === "ok") {
                    // Location info
                    $('#cityName').html(result['location']['name']);
                    $('#region').html(result['location']['region']);
                    $('#country').html(result['location']['country']);
                    $('#currentTime').html(result['location']['localtime']);
                    $('#timeZone').html(result['location']['tz_id']);
                    // Weather info
                    $('#windDirection').html(result['weather']['wind_dir']);
                    $('#windSpeedMph').html(result['weather']['wind_mph']);
                    $('#tempC').html(result['weather']['temp_c']);
                    $('#tempF').html(result['weather']['temp_f']);
                    $('#condition').html(result['weather']['condition']['text']);
                    $('#weatherIcon').attr('src', `https:${result['weather']['condition']['icon']}`);
                }
            }
        })
            .fail((jqxhr, textStatus, error) => {
                let err = `${textStatus}, ${error}`;
                $('#error').show();
                $('#errorInfo').text(`Couldn't load details about selected country: ${err}`);

            });
    }
    // On page load, get info about London
    getInfo();
    // On click Submit, get information about selected capital city.
    $('#btnRun').on('click', getInfo);
});