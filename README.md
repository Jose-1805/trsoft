* * * * * cd /home/jose1805/Documentos/trading/Trsoft/CopyTrading/Trsoft_copy && php artisan schedule:run >> /dev/null 2>&1

Para enviar a Google Cloud Platform

1. editar los siguientes archivos:

	resources/views/app.blade.php
	-Descomentar la importación del css que inicia con static
	 y comentar el que está habilitado
	-Descomentar la variable base_resources que contiene static
	 y comentar la que está vacia

	resources/sass/fonts.css
	-Descomentar las fuentes que tienen static y comentar las que no lo tienen

	app/Providers/AuthServiceProvider
	-Descomentar Passport::loadKeysFrom('/srv/storage');

2. Ejecutar en la consola npm run production

3. Editar el archivo public/css/app.css
	- Remplazar las coincidencias 
		/fonts/vendor/semantic-ui-css/
		por /static/fonts/vendor/semantic-ui-css/

4. Ejecutar gcloud app deploy --version=(NUMERO DE VERSIÔN)