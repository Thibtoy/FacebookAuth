Pour tester ce projet, tout d'abbord, verifiez que vous possédez bien tous les logiciels nécessaires au bon fonctionnement du projet (nodeJS, mongodb, postman(facultatif si on test juste l'authentification facebook)). 

Pour commencer, lancez votre serveur mongodb pour que l'application web puisse s'y connecter, placez-vous ensuite dans le repo avec votre terminal, puis lancez la commande "npm install". 

Vérifiez dans le fichier "server.js", à la ligne 17, si la fonction "mongoose.connect" pointe bien vers la bonne adresse pour se connecter à votre server mongodb.


!!!!Dans le fichier "config.js", situé dans le dossier "config", renseignez un "SECRET" qui seras utilisé pour crypter les tokens, renseignez pour "API_ID", l'identifiant de votre application d'authentification facebook, et pour "SECRET_KEY", la clé de votre application d'authentification facebook, pour configurer votre application d'authentification facebook, rendez vous sur https://developers.facebook.com/ !!!!

Finalement, lancez la commande "npm start".
					
						Avec postman test authentification locale:

La seule route protégée est la route "localhost:3000/user", si vous tentez d'y accéder dés maintenant avec votre browser, vous serez redirigé vers la route "/login" qui afficheras "can not GET /login" puisque la route n'est accessible que en POST, il n'y a pas de template pour la route de toute manière. Pour tester l'authentification locale, il nous faudras d'abbord créer un profile, démarrez POSTMAN, utilisez une méthode "POST" vers l'url "localhost:3000/register" en passant les informations suivantes(key/value) au body de l'objet request(cocher "body" puis "x-www-form-urlencoded"): 
			-email: votre email,
			-username: votre username,
			-name: votre name,
			-password: votre password,
			-password2: validation de votre password.

Une fois le profil créé, toujours sur postman, utilisez une méthode "POST" vers l'url "localhost:3000/login" en passant, toujours au body de l'objet request, les informations suivantes:
			-username: votre username,
			-password: votre password.
Si les informations de connection sont bonnes, vous récupérerez dans la response le profile user vous correspondant, si elles sont fausse vous récupérerez un template html en réponse, qui affiches un message d'erreur.

Si vous faites maintenant un "GET" vers "localhost:3000/user" sans passer aucune information à la request, vous aurez maintenant accés à cette route et y obtiendrez à nouveau votre profile user.

En faisant un "GET" vers "localhost:3000/logout" vous déconnecterez votre profile, et, tentant de vous rendre à nouveau sur "localhost:3000/user" avec un "GET", vous obtiendrez dans l'objet response, un template html vous indiquant une erreur "can not GET /login", qui prouve bien que vous n'avez plus accés à /user et que l'application tente de vous rediriger vers la page de connection.




 						Avec le browser test authentification facebook:

 Avec votre browser rendez vous sur l'url "localhost:3000/auth/facebook", validez l'authentification via votre profile facebook, vous serez redirigé directemment vers la page /user qui afficheras les infos "facebook" de votre profile user et vous y aurez donc bien accés par ce moyen(même si vous avez déjà un profile user local, l'authentification par facebook vous créeras un deuxième profile user qui enregistreras vos infos, car je n'ai pas implémenté de tcheck pour compléter le profile user existant).

 En allant maintenant sur "localhost:3000/logout", vous déconnecterez votre profile, et, tentant de vous rendre à nouveau sur "localhost:3000/user", vous obtiendrez une erreur "can not GET /login", qui prouve bien que vous n'avez plus accés à /user et que l'application tente de vous rediriger vers la page de connection.
