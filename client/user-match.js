
function mediaProxy (image) {
	return 'https://images.weserv.nl/?url=' +
		encodeURIComponent (image.replace (/^http(s)?\:\/\//, '')) +
		'&errorredirect=' + encodeURIComponent ('vinayaka.distsn.org/missing.png')
}


function search (detail) {
	var user_and_host = document.getElementById ('user-input').value;
	var match_1 = /^https:\/\/([\w\.\-]+)\/@([\w]+)$/.exec (user_and_host);
	var match_2 = /^([\w]+)@([\w\.\-]+)$/.exec (user_and_host);
	var match_3 = /^@([\w]+)@([\w\.\-]+)$/.exec (user_and_host);
	var user_and_host_array = user_and_host.split ('@');
	if (match_1) {
		var host = match_1[1];
		var user = match_1[2];
		search_impl (host, user, detail);
	} else if (match_2) {
		var user = match_2[1];
		var host = match_2[2];
		search_impl (host, user, detail);
	} else if (match_3) {
		var user = match_3[1];
		var host = match_3[2];
		search_impl (host, user, detail);
	} else {
		document.getElementById ('placeholder').innerHTML =
			'<strong>' +
			'User name or instance is not available.' +
			'</strong>'
	}
}


function search_impl (host, user, detail) {
	save_inputs (host, user);
	var url =
		'/cgi-bin/vinayaka-user-match-api.cgi?' +
		encodeURIComponent (host) + '+' +
		encodeURIComponent (user);
	var request = new XMLHttpRequest;
	request.open ('GET', url);
	request.onload = function () {
		if (request.readyState === request.DONE) {
			document.getElementById ('search-button').removeAttribute ('disabled');
			document.getElementById ('detail-button').removeAttribute ('disabled');
			if (request.status === 200) {
				var response_text = request.responseText;
				try {
					var users = JSON.parse (response_text);
					if (typeof users === 'string') {
						var message = 'Sorry, our server is now too busy. Try it again later.';
						document.getElementById ('placeholder').innerHTML =
							'<strong>' + message + '</strong>';
					} else {
						show_users (users, detail, host, user);
						document.getElementById ('anti-harassment-message').removeAttribute ('style');
						activate_share_button (users, host, user);
					}
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
		'Searching... (about 60 seconds)' +
		'</strong>'
	document.getElementById ('search-button').setAttribute ('disabled', 'disabled');
	document.getElementById ('detail-button').setAttribute ('disabled', 'disabled');
	request.send ();
}


function save_inputs (host, user) {
	window.localStorage.setItem ('host', host);
	window.localStorage.setItem ('user', user);
}


window.addEventListener ('load', function () {
	var host = window.localStorage.getItem ('host');
	var user = window.localStorage.getItem ('user');
	if (host && user) {
		document.getElementById ('user-input').value = user + '@' + host;
	}
}, false); /* window.addEventListener ('load', function () { */



window.addEventListener ('load', function () {
document.getElementById ('search-button').addEventListener ('click', function () {
	document.getElementById ('explanation-detail').setAttribute ('style', 'display: none;');
	search (false);
}, false);

document.getElementById ('user-input').addEventListener ('keydown', function (event) {
	if (event.key === 'Enter') {
		document.getElementById ('explanation-detail').setAttribute ('style', 'display: none;');
		search (false);
	}
}, false);

document.getElementById ('detail-button').addEventListener ('click', function () {
	document.getElementById ('explanation-detail').removeAttribute ('style');
	search (true);
}, false);
}, false); /* window.addEventListener ('load', function () { */


function escapeHtml (text) {
        text = text.replace (/\&/g, '&amp;');
        text = text.replace (/\</g, '&lt;');
        text = text.replace (/\>/g, '&gt;');
        return text;
};


function escapeAttribute (text) {
        text = text.replace (/\"/g, '&quot;')
        return text
}


function show_users (users, detail, current_host, current_user) {
var placeholder = document.getElementById ('placeholder');
var html = '';
var cn;
var cn_intersection;

for (cn = 0; cn < users.length; cn ++) {
	var user;
	user = users [cn];
	var this_is_me;
	this_is_me = (user.host === current_host && user.user === current_user)
	var blacklisted
	blacklisted = user.blacklisted
	if (detail || ((! this_is_me) && (! blacklisted)))
	{
		var user_html = '';
		var m_following = 'Following'
		var m_similarity = 'Similarity'
		var m_bot = 'Bot'
		if (blacklisted) {
			user_html +=
				'<p>' +
				'<img class="avatar" src="blacklisted.png">' +
				'<span class="headline">' + escapeHtml (user.user) + '@<wbr>' + escapeHtml (user.host) + ' ' +
				'<a class="icon" href="javascript:openBlacklistExplanation()">?</a>' +
				'</span>' +
				'<br>' +
				m_similarity + ' ' + user.similarity.toFixed (0) +
				(user.following? '<br>' + m_following: '') +
				(user.type === 'Service'? '<br><strong>' + m_bot + '</strong>': '')
		} else {
			user_html +=
				'<p>' +
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
				'</a>' +
				'<br>' +
				m_similarity + ' ' + user.similarity.toFixed (0) +
				(user.following? '<br>' + m_following: '') +
				(user.type === 'Service'? '<br><strong>' + m_bot + '</strong>': '')
		}
		if (detail) {
			user_html += '</p><p>';
			user_html += '<small>';
			for (cn_intersection = 0; cn_intersection < user.intersection.length; cn_intersection ++) {
				user_html += escapeHtml (user.intersection[cn_intersection].word)
				user_html += ' '
				user_html += '(' + (user.intersection[cn_intersection].rarity).toFixed (2) + ')'
				user_html += ' '
			}
			user_html += '</small>';
		}
		user_html += '</p>';
		html += user_html;
	}
}
placeholder.innerHTML = html;
} /* function show_users (users) { */


window.addEventListener ('load', function () {
document.getElementById ('user-input').addEventListener ('input', function () {
	var user_and_host = document.getElementById ('user-input').value;
	var user_and_host_array = user_and_host.split ('@');
	if (user_and_host_array.length == 2 && user_and_host_array[1].length == 0)
	{
		var user = user_and_host_array [0];
		var options =
			'<option value="' + user + '@' + 'mastodon.social' +'"></option>' +
			'<option value="' + user + '@' + 'pawoo.net' +'"></option>' +
			'<option value="' + user + '@' + 'friends.nico' +'"></option>' +
			'<option value="' + user + '@' + 'misskey.xyz' +'"></option>'
		document.getElementById ('completes').innerHTML = options;
	}
}, false); /* document.getElementById ('user-input').addEventListener ('input', function () { */
}, false); /* window.addEventListener ('load', function () { */


window.addEventListener ('load', function () {
	var match = /^\?([\w\.\-]+)\+(\w+)$/.exec (window.location.search);
	if (match) {
		var host = match [1];
		var user = match [2];
		document.getElementById ('user-input').value = user + '@' + host;
		search_impl (host, user, false);
	}
}, false); /* window.addEventListener ('load', function () { */


var g_share_intent = '';


function activate_share_button (users, current_host, current_user) {
	var intent = '';
	intent += '@' + current_user + '@' + current_host + ' ' +
		'is similar to:' + "\n\n";
	for (var cn = 0; cn < 6 && cn < users.length; cn ++) {
		var user = users[cn];
		if (! (user.host === current_host && user.user === current_user)) {
			intent += '@' + user.user + '@' + user.host + "\n";
		}
	}
	intent += "\n";
	intent += 'http://MastodonUserMatching.tk' + "\n";
	intent += '#MastodonUserMatching' + "\n";
	g_share_intent = intent;
	document.getElementById ('share-button').removeAttribute ('style');
};


window.addEventListener ('load', function () {
document.getElementById ('share-button').addEventListener ('click', function () {
	var intent = g_share_intent;
	var host = window.localStorage.getItem ('host');
	var url;
	if (host && 0 < host.length) {
		url = 'http://' + host + '/share?text=' + encodeURIComponent (intent);
	} else {
		url = 'https://masha.re/#' + encodeURIComponent (intent);
	}
	window.open (url);
}, false); /* document.getElementById ('share-button').addEventListener ('click', function () { */
}, false); /* window.addEventListener ('load', function () { */


window.openBlacklistExplanation = function () {
	alert ('Suspicion of bot, spam or harassment.');
};


