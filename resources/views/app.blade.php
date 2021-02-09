<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" type="text/css" href="{{asset('/static/css/app.css')}}">
        <!--<link rel="stylesheet" type="text/css" href="{{asset('/css/app.css')}}">-->
        <title>{{ env('APP_NAME', 'Laravel') }}</title>
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <style type="text/css" media="screen">
          body{
            padding: 0px !important;
            margin: 0px !important;
          }

          .trsoft-full-loading{
            position: fixed;
            width: 100%;
            height: 100%;
            display: flex;
              align-items: center;
              /* Permalink - use to edit and share this gradient: https://colorzilla.com/gradient-editor/#ffffff+20,082e44+100&1+0,0.1+100 */
              background: -moz-radial-gradient(center, ellipse cover,  rgba(255,255,255,1) 0%, rgba(255,255,255,0.82) 20%, rgba(8,46,68,0.07) 100%); /* FF3.6-15 */
              background: -webkit-radial-gradient(center, ellipse cover,  rgba(255,255,255,1) 0%,rgba(255,255,255,0.82) 20%,rgba(8,46,68,0.07) 100%); /* Chrome10-25,Safari5.1-6 */
              background: radial-gradient(ellipse at center,  rgba(255,255,255,1) 0%,rgba(255,255,255,0.82) 20%,rgba(8,46,68,0.07) 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
              filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#ffffff', endColorstr='#1a082e44',GradientType=1 ); /* IE6-9 fallback on horizontal gradient */

          }

          .trsoft-full-loading img{
            margin: 0 auto;
            display: inline-block;
          }

          .trsoft-container-loading{
            position:absolute;
            overflow: hidden;
              left: 50%;
              transform: translate(-50%, 0);
            animation-name: anim_show;
            animation-duration: 3.5s;
          }

          .trsoft-container-loading:after{
            content: '';
            position: absolute;
            width:0%;
            height: 0%;
            border-bottom-left-radius: 0%; 
            border-top-left-radius: 0%; 
            border-top-right-radius: 0%; 
            border-bottom-right-radius: 0%; 
            background-color: rgba(255,255,255,.8);
            animation-name: anim;
            animation-duration: 8s;
            animation-iteration-count: infinite;
          }

          @keyframes anim_show{
            from{
              opacity: 0;
            }
            to{
              opacity: 1;
            }
          }

          @keyframes anim{
            0% {
              width: 0%;
              height: 100%;
              left: 0%;
              top: 0%;

              border-bottom-left-radius: 0%; 
              border-top-left-radius: 0%; 
              border-top-right-radius: 30%; 
              border-bottom-right-radius: 10%; 

              opacity: 1;
            }

            30% {
              width: 130%;
              height: 100%;
              left: 0%;
              top: 0%;

              border-bottom-left-radius: 0%; 
              border-top-left-radius: 0%; 
              border-top-right-radius: 50%; 
              border-bottom-right-radius: 50%;
              opacity: 0;
            }
            31% {
              width: 0%;
              height: 0%;
              left: 100%;
              top: 100%;
              opacity: 0;
            }
            32% {
              width: 0%;
              height: 0%;
              left: 100%;
              top: 100%;

              border-bottom-left-radius: 20%; 
              border-top-left-radius: 30%; 
              border-top-right-radius: 0%; 
              border-bottom-right-radius: 0%; 
              opacity: 1;
            }
            60% {
              width: 130%;
              height: 130%;
              left: -30%;
              top: -30%;

              border-bottom-left-radius: 20%; 
              border-top-left-radius: 50%; 
              border-top-right-radius: 0%; 
              border-bottom-right-radius: 0%; 
              opacity: 0;
            }
            61% {
              width: 0%;
              height: 0%;
              left: 50%;
              top: 100%;
              opacity: 0;
            }
            62% {
              width: 0%;
              height: 0%;
              left: 50%;
              top: 100%;

              border-bottom-left-radius: 0%; 
              border-top-left-radius: 40%; 
              border-top-right-radius: 40%; 
              border-bottom-right-radius: 0%; 
              opacity: 1;
            }
            100% {        
              width: 120%;
              height: 120%;
              left: -10%;
              top: -20%;

              border-bottom-left-radius: 30%; 
              border-top-left-radius: 50%; 
              border-top-right-radius: 50%; 
              border-bottom-right-radius: 30%; 
              opacity: 0;
            }
          }
        </style>

        <!-- Global site tag (gtag.js) - Google Analytics -->
        <script async src="https://www.googletagmanager.com/gtag/js?id=UA-162877014-1"></script>
        <script>
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'UA-162877014-1');
        </script>

        <!-- Facebook Pixel Code -->
        <script>
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '1815966208537764');
          fbq('track', 'PageView');
        </script>
        <noscript><img height="1" width="1" style="display:none"
          src="https://www.facebook.com/tr?id=1815966208537764&ev=PageView&noscript=1"
        /></noscript>
        <!-- End Facebook Pixel Code -->
    </head>
    <body>
        <div id="app">
            <div class="trsoft-full-loading">
              <div class="trsoft-container-loading">
                <img class="trsoft-img-loading" src="./images/logo_icon/logo_xs.png" alt=""/>
                <p style='text-align: center;'>Loading ...</p>
              </div>
            </div>
        </div>
        <script defer src="https://www.google.com/recaptcha/api.js?render=6Le9Y-UUAAAAAFocchkv8evcRyF60kxzTUFMNnWA"></script>
        <script defer>
            base_resources = '/static';
            //base_resources = '';
            grecaptcha.ready(function() {
                let body = document.getElementsByTagName('body');
                
                var s = document.createElement("script");
                s.type = "text/javascript";
                s.src = window.location.origin+base_resources+"/js/app.js";
                body[0].append(s);

            });
        </script>
        <!--Start of Tawk.to Script-->
        <script type="text/javascript">
        var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
        (function(){
        var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
        s1.async=true;
        s1.src='https://embed.tawk.to/5e8ce0d869e9320caac141ea/default';
        s1.charset='UTF-8';
        s1.setAttribute('crossorigin','*');
        s0.parentNode.insertBefore(s1,s0);
        })();
        </script>
        <!--End of Tawk.to Script-->
    </body>
</html>