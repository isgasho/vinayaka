
function mediaProxy (image) {
	return 'https://images.weserv.nl/?url=' +
		encodeURIComponent (image.replace (/^http(s)?\:\/\//, '')) +
		'&errorredirect=' + encodeURIComponent ('vinayaka.distsn.org/missing.png')
}


function search () {
	var keyword = document.getElementById ('keyword-input').value;
	if (0 < keyword.length) {
		search_impl (keyword);
	} else {
		document.getElementById ('placeholder').innerHTML =
			'<strong>' +
			'Keyword is not available.' +
			'</strong>'
	}
}


function search_impl (keyword) {
	var url = '/cgi-bin/vinayaka-user-search-api.cgi?' +
		encodeURIComponent (keyword);
	var request = new XMLHttpRequest;
	request.open ('GET', url);
	request.onload = function () {
		if (request.readyState === request.DONE) {
			document.getElementById ('search-button').removeAttribute ('disabled');
			if (request.status === 200) {
				var response_text = request.responseText;
				try {
					var users = JSON.parse (response_text);
					show_users (users);
					document.getElementById ('anti-harassment-message').removeAttribute ('style');
				} catch (e) {
					document.getElementById ('placeholder').innerHTML =
						'<strong>' +
						'Sorry.' +
						'</strong>'
				}
			} else {
				document.getElementById ('placeholder').innerHTML =
					'<strong>' +
					'Sorry.' +
					'</strong>'
			}
		}
	}
	document.getElementById ('anti-harassment-message').setAttribute ('style', 'display:none;');
	document.getElementById ('placeholder').innerHTML =
		'<strong>' +
		'Searching...' +
		'</strong>'
	document.getElementById ('search-button').setAttribute ('disabled', 'disabled');
	request.send ();
}


window.addEventListener ('load', function () {
document.getElementById ('search-button').addEventListener ('click', function () {
	search ()
}, false)

document.getElementById ('keyword-input').addEventListener ('keydown', function (event) {
	if (event.key === 'Enter') {
		search ();
	}
}, false)
}, false) /* window.addEventListener ('load', function () { */


function escapeHtml (text) {
        text = text.replace (/\&/g, '&amp;');
        text = text.replace (/\</g, '&lt;');
        text = text.replace (/\>/g, '&gt;');
        return text;
}


function escapeAttribute (text) {
        text = text.replace (/\"/g, '&quot;')
        return text
}


function show_users (users) {
	if (users.length <= 100) {
		show_users_impl (users)
	} else {
		var message = users.length + ' users found.'
		var reply = window.confirm (message)
		if (reply) {
			show_users_impl (users)
		} else {
			var placeholder = document.getElementById ('placeholder');
			var html =
				'<p>' +
				users.length + ' users found' +
				'</p>'
			placeholder.innerHTML = html
		}
	}
}


function show_users_impl (users) {
var m_bot = 'Bot'
var placeholder = document.getElementById ('placeholder');
var html = '';

for (cn = 0; cn < users.length; cn ++) {
	var user;
	user = users [cn];
	var user_html = '';
	user_html += '<p>'
	if (! user.blacklisted) {
		user_html +=
			'<a href="' +
			escapeAttribute (user.url) +
			'" target="vinayaka-external-user-profile">' +
			'<img class="avatar" src="';
		if (user.avatar && 0 < user.avatar.length) {
			user_html += mediaProxy (user.avatar)
		} else {
			user_html += 'missing.png';
		}
		user_html +=
			'">' +
			'</a>' +
			'<a href="' +
			escapeAttribute (user.url) +
			'" target="vinayaka-external-user-profile" class="headline">' +
			escapeHtml (user.user) + '@<wbr>' + escapeHtml (user.host) +
			'</a>'
	}
	user_html +=
		(user.type === 'Service'? '<br><strong>' + m_bot + '</strong>': '') +
		'<br>' + escapeHtml (user.text) +
		'</p>'
	html += user_html;
}
placeholder.innerHTML = html;
} /* function show_users (users) { */


window.openBlacklistExplanation = function () {
	alert ('Suspicion of bot, spam or harassment.');
}


