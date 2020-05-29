<!DOCTYPE html>

<html lang="en">
    <head>
        <meta charset="utf-8">

        <title>Jared Grounds: Contact</title>
        <meta name="description" content="Portfolio">
        <meta name="author" content="Jared Grounds">

        <link rel="stylesheet" href="/css/contact.css">
        <link rel="apple-touch-icon-precomposed" sizes="57x57" href="/images/favicons/apple-touch-icon-57x57.png" />
        <link rel="apple-touch-icon-precomposed" sizes="114x114" href="/images/favicons/apple-touch-icon-114x114.png" />
        <link rel="apple-touch-icon-precomposed" sizes="72x72" href="/images/favicons/apple-touch-icon-72x72.png" />
        <link rel="apple-touch-icon-precomposed" sizes="144x144" href="/images/favicons/apple-touch-icon-144x144.png" />
        <link rel="apple-touch-icon-precomposed" sizes="60x60" href="/images/favicons/apple-touch-icon-60x60.png" />
        <link rel="apple-touch-icon-precomposed" sizes="120x120" href="/images/favicons/apple-touch-icon-120x120.png" />
        <link rel="apple-touch-icon-precomposed" sizes="76x76" href="/images/favicons/apple-touch-icon-76x76.png" />
        <link rel="apple-touch-icon-precomposed" sizes="152x152" href="/images/favicons/apple-touch-icon-152x152.png" />
        <link rel="icon" type="image/png" href="/images/favicons/favicon-196x196.png" sizes="196x196" />
        <link rel="icon" type="image/png" href="/images/favicons/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/png" href="/images/favicons/favicon-32x32.png" sizes="32x32" />
        <link rel="icon" type="image/png" href="/images/favicons/favicon-16x16.png" sizes="16x16" />
        <link rel="icon" type="image/png" href="/images/favicons/favicon-128.png" sizes="128x128" />
        <meta name="application-name" content="&nbsp;"/>
        <meta name="msapplication-TileColor" content="#FFFFFF" />
        <meta name="msapplication-TileImage" content="/images/favicons/mstile-144x144.png" />
        <meta name="msapplication-square70x70logo" content="/images/favicons/mstile-70x70.png" />
        <meta name="msapplication-square150x150logo" content="/images/favicons/mstile-150x150.png" />
        <meta name="msapplication-wide310x150logo" content="/images/favicons/mstile-310x150.png" />
        <meta name="msapplication-square310x310logo" content="/images/favicons/mstile-310x310.png" />


        <link href="https://fonts.googleapis.com/css2?family=Lexend+Deca&display=swap" rel="stylesheet"> 
        <meta name ="viewport" content="width=device-width,initial-scale=1.0">

        <script src="https://code.jquery.com/jquery-3.3.1.js" integrity="sha256-2Kok7MbOyxpgUVvAk/HJ2jigOSYS2auK4Pfzbm7uH60=" crossorigin="anonymous"></script>
        <script src="https://www.google.com/recaptcha/api.js" async defer></script>
        <script src="/scripts/loadEssentials.js"></script>
    </head>

    <body>
        <div class="navbar"></div>

        <div class="main">
            <br><br><br>

            <div class="form-container">
            <h1>Any questions?</h1><br>
            <p>Submit them here!</p><br><br>
            <form action="https://getsimpleform.com/messages?form_api_token=67cac7e7015098689c84839c616a1c64" method="POST">
                <div class="form-width">
                <input type="text" name="name" id="form-name" required placeholder="Name"/><br>
                <input type="text" name="email" id="form-email" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" title="Enter a valid e-mail address" required placeholder="E-mail Address"/><br>
                <input type="text" name="subject" id="form-subject" required placeholder="Subject"><br>
                <textarea name="message" required id= "form-message" rows="10"  maxlength="255" placeholder="Message"></textarea><br>
                </div>
                <p id=charcount>Characters left: 256</p><br>
                <div class="g-recaptcha" data-sitekey="6LdDjv0UAAAAAD4eogTdG8Pb8iEtOe7_3auK7EzL"></div>
                <input type="submit" value="Send Message">
              </form>

              <?php

if(isset($_POST['submit']))
{

function CheckCaptcha($userResponse) {
        $fields_string = '';
        $fields = array(
            'secret' => '6LdDjv0UAAAAALmV-P06u0k2Llj61iLmwPpaw1B7' ,
            'response' => $userResponse
        );

        foreach($fields as $key=>$value)
        $fields_string .= $key . '=' . $value . '&';
        $fields_string = rtrim($fields_string, '&');

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, 'https://www.google.com/recaptcha/api/siteverify');
        curl_setopt($ch, CURLOPT_POST, count($fields));
        curl_setopt($ch, CURLOPT_POSTFIELDS, $fields_string);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, True);

        $res = curl_exec($ch);
        curl_close($ch);

        return json_decode($res, true);
    }


    // Call the function CheckCaptcha
    $result = CheckCaptcha($_POST['g-recaptcha-response']);

    if ($result['success']) {
        //If the user has checked the Captcha box
        echo "Captcha verified Successfully";
	
    } else {
        // If the CAPTCHA box wasn't checked
       echo '<script>alert("Error Message");</script>';
    }
}
    ?>

            </div>
        </div>
        
        <footer></footer>

    </body>
</html>
