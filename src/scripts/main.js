/* Hughes Media video site front end. No dependencies. */
( function () {
	'use strict';

	var PHONE = '404.848.0487';
	var t = {
		openMenu: 'Open menu',
		closeMenu: 'Close menu',
		showing: 'Showing %d videos',
		showingOne: 'Showing 1 video',
		seenAll: "You've seen all %d videos.",
		selected: '%s filter, selected',
		sending: 'Sending…',
		serverError: "Something went wrong and your request wasn't sent. Please try again or call " + PHONE + '.',
		required: 'Please enter your %s.',
		email: 'Enter an email like name@company.com.',
		website: 'Enter a full web address, starting with https://',
	};
	var mainSiteHost = document.body.getAttribute( 'data-main-host' ) || '';
	var fmt = function ( str, val ) { return String( str ).replace( /%[ds]/, val ); };
	var track = function ( event, data ) {
		window.dataLayer = window.dataLayer || [];
		var payload = { event: event };
		for ( var k in data || {} ) { payload[ k ] = data[ k ]; }
		window.dataLayer.push( payload );
	};

	/* ---------- Mobile navigation ---------- */
	( function () {
		var toggle = document.querySelector( '.hm-nav-toggle' );
		var nav = document.getElementById( 'hm-nav' );
		if ( ! toggle || ! nav ) { return; }

		var setOpen = function ( open ) {
			nav.classList.toggle( 'is-open', open );
			toggle.setAttribute( 'aria-expanded', open ? 'true' : 'false' );
			toggle.setAttribute( 'aria-label', open ? t.closeMenu : t.openMenu );
		};
		toggle.addEventListener( 'click', function () {
			setOpen( toggle.getAttribute( 'aria-expanded' ) !== 'true' );
		} );
		document.addEventListener( 'keydown', function ( e ) {
			if ( e.key === 'Escape' && nav.classList.contains( 'is-open' ) ) {
				setOpen( false );
				toggle.focus();
			}
		} );
		window.matchMedia( '(min-width: 1024px)' ).addEventListener( 'change', function ( mq ) {
			if ( mq.matches ) { setOpen( false ); }
		} );
	} )();

	/* ---------- Work grid: filters + show more ---------- */
	( function () {
		var root = document.querySelector( '[data-work]' );
		if ( ! root ) { return; }

		var PAGE = 9;
		var cards = Array.prototype.slice.call( root.querySelectorAll( '.hm-card' ) );
		var groups = Array.prototype.slice.call( root.querySelectorAll( '[data-filter-group]' ) );
		var countEl = root.querySelector( '[data-count]' );
		var emptyEl = root.querySelector( '[data-empty]' );
		var moreBtn = root.querySelector( '[data-more]' );
		var endEl = root.querySelector( '[data-end]' );
		var clearEl = root.querySelector( '[data-clear]' );
		var limit = PAGE;
		var state = {};

		var params = new URLSearchParams( window.location.search );
		groups.forEach( function ( g ) {
			state[ g.dataset.filterGroup ] = params.get( g.dataset.filterGroup ) || '';
		} );

		// Chips become toggle buttons.
		groups.forEach( function ( g ) {
			g.querySelectorAll( '.hm-chip' ).forEach( function ( chip ) {
				chip.setAttribute( 'role', 'button' );
				chip.addEventListener( 'click', function ( e ) {
					e.preventDefault();
					state[ g.dataset.filterGroup ] = chip.dataset.value;
					limit = PAGE;
					render( true );
				} );
				chip.addEventListener( 'keydown', function ( e ) {
					if ( e.key === ' ' ) { e.preventDefault(); chip.click(); }
				} );
			} );
		} );

		var clearAll = function ( e ) {
			e.preventDefault();
			Object.keys( state ).forEach( function ( k ) { state[ k ] = ''; } );
			limit = PAGE;
			render( true );
		};
		if ( clearEl ) { clearEl.addEventListener( 'click', clearAll ); }
		var emptyClear = root.querySelector( '.hm-empty__clear' );
		if ( emptyClear ) { emptyClear.addEventListener( 'click', clearAll ); }

		if ( moreBtn ) {
			moreBtn.addEventListener( 'click', function () {
				var firstNew = limit;
				limit += PAGE;
				render( false );
				// Move focus to the first newly shown video.
				var shown = cards.filter( function ( c ) { return ! c.hidden; } );
				var link = shown[ firstNew ] && shown[ firstNew ].querySelector( '.hm-card__link' );
				if ( link ) { link.focus(); }
			} );
		}

		function matches( card ) {
			return Object.keys( state ).every( function ( k ) {
				return ! state[ k ] || ( ' ' + ( card.dataset[ k ] || '' ) + ' ' ).indexOf( ' ' + state[ k ] + ' ' ) !== -1;
			} );
		}

		function render( updateUrl ) {
			var matched = cards.filter( matches );
			cards.forEach( function ( c ) { c.hidden = true; } );
			matched.forEach( function ( c, i ) { c.hidden = i >= limit; } );

			groups.forEach( function ( g ) {
				g.querySelectorAll( '.hm-chip' ).forEach( function ( chip ) {
					var on = chip.dataset.value === state[ g.dataset.filterGroup ];
					chip.removeAttribute( 'aria-current' );
					chip.setAttribute( 'aria-pressed', on ? 'true' : 'false' );
					if ( on && chip.dataset.value ) {
						chip.setAttribute( 'aria-label', fmt( t.selected, chip.textContent.trim() ) );
					} else {
						chip.removeAttribute( 'aria-label' );
					}
				} );
			} );

			var n = matched.length;
			if ( countEl ) { countEl.textContent = n === 1 ? t.showingOne : fmt( t.showing, n ); }
			if ( emptyEl ) { emptyEl.hidden = n > 0; }
			var active = Object.keys( state ).some( function ( k ) { return state[ k ]; } );
			if ( clearEl ) { clearEl.hidden = ! active; }
			if ( moreBtn ) { moreBtn.hidden = n <= limit; }
			if ( endEl ) {
				endEl.hidden = ! ( n > PAGE && n <= limit );
				endEl.textContent = fmt( t.seenAll, n );
			}

			if ( updateUrl ) {
				var url = new URL( window.location.href );
				Object.keys( state ).forEach( function ( k ) {
					if ( state[ k ] ) { url.searchParams.set( k, state[ k ] ); } else { url.searchParams.delete( k ); }
				} );
				window.history.replaceState( null, '', url );
				track( 'hm_filter', { hm_service: state.service || 'all', hm_industry: state.industry || 'all' } );
			}
		}

		render( false );
	} )();

	/* ---------- Viewfinder timecode (decorative) ---------- */
	( function () {
		var el = document.querySelector( '[data-timecode]' );
		if ( ! el || window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches ) { return; }
		var start = performance.now();
		var pad = function ( n ) { return n < 10 ? '0' + n : String( n ); };
		var visible = true;
		if ( 'IntersectionObserver' in window ) {
			new IntersectionObserver( function ( entries ) { visible = entries[ 0 ].isIntersecting; } ).observe( el );
		}
		setInterval( function () {
			if ( ! visible || document.hidden ) { return; }
			var f = Math.floor( ( performance.now() - start ) / ( 1000 / 24 ) );
			var s = Math.floor( f / 24 );
			el.textContent = pad( Math.floor( s / 3600 ) ) + ':' + pad( Math.floor( s / 60 ) % 60 ) + ':' + pad( s % 60 ) + ':' + pad( f % 24 );
		}, 1000 / 24 );
	} )();

	/* ---------- Click-to-play video ---------- */
	document.querySelectorAll( '[data-player]' ).forEach( function ( player ) {
		var src = player.getAttribute( 'data-src' );
		var link = player.querySelector( '.hm-player__play' );
		if ( ! src || ! link ) { return; }
		link.addEventListener( 'click', function ( e ) {
			e.preventDefault();
			var iframe = document.createElement( 'iframe' );
			iframe.src = src;
			iframe.title = player.getAttribute( 'data-title' ) || 'Video';
			iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen';
			iframe.allowFullscreen = true;
			player.classList.add( 'is-playing' );
			player.appendChild( iframe );
			iframe.focus();
			track( 'hm_video_play', { video_title: iframe.title, video_url: link.href } );
		} );
	} );

	/* ---------- Discovery call form ---------- */
	( function () {
		var form = document.querySelector( '[data-lead-form]' );
		if ( ! form ) { return; }
		var endpoint = form.getAttribute( 'data-endpoint' );

		var success = document.querySelector( '[data-form-success]' );
		var alertEl = form.querySelector( '[data-form-alert]' );
		var submit = form.querySelector( '[data-submit]' );

		var setError = function ( input, msg ) {
			var field = input.closest( '.hm-field' );
			var err = document.getElementById( input.id + '-error' );
			if ( err ) { err.textContent = msg || ''; }
			field.classList.toggle( 'is-invalid', !! msg );
			if ( msg ) { input.setAttribute( 'aria-invalid', 'true' ); } else { input.removeAttribute( 'aria-invalid' ); }
		};

		var validate = function ( input ) {
			var v = input.value.trim();
			var msg = '';
			if ( input.required && ! v ) {
				msg = fmt( t.required, input.dataset.label || input.name );
			} else if ( v && input.type === 'email' && ! /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test( v ) ) {
				msg = t.email;
			} else if ( v && input.type === 'url' && ! /^https?:\/\/[^\s.]+\.[^\s]{2,}$/i.test( v ) ) {
				msg = t.website;
			}
			setError( input, msg );
			return ! msg;
		};

		var inputs = Array.prototype.slice.call( form.querySelectorAll( 'input[id^="hm-"]:not([type=checkbox]):not(#hm-hp)' ) );
		var showServerError = function () {
			alertEl.textContent = t.serverError;
			alertEl.hidden = false;
		};
		inputs.forEach( function ( input ) {
			input.addEventListener( 'blur', function () { if ( input.value.trim() || input.getAttribute( 'aria-invalid' ) ) { validate( input ); } } );
			input.addEventListener( 'input', function () { if ( input.getAttribute( 'aria-invalid' ) ) { validate( input ); } } );
		} );

		form.addEventListener( 'submit', function ( e ) {
			e.preventDefault();
			alertEl.hidden = true;
			var firstBad = null;
			inputs.forEach( function ( input ) {
				if ( ! validate( input ) && ! firstBad ) { firstBad = input; }
			} );
			if ( firstBad ) { firstBad.focus(); return; }

			if ( ! endpoint ) { showServerError(); return; }

			// Bots fill the hidden field: pretend success, send nothing.
			var hp = form.querySelector( '#hm-hp' );
			if ( hp && hp.value ) { form.hidden = true; success.hidden = false; return; }

			submit.disabled = true;
			submit.textContent = t.sending;

			var data = new FormData( form );
			data.delete( '_next' );
			fetch( endpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' }, credentials: 'omit' } )
				.then( function ( res ) {
					return res.json().catch( function () { return {}; } ).then( function ( body ) { return { status: res.status, body: body }; } );
				} )
				.then( function ( r ) {
					if ( r.status >= 200 && r.status < 300 ) {
						track( 'hm_form_submit', { hm_form: 'discovery_call' } );
						form.hidden = true;
						success.hidden = false;
						success.focus();
						return;
					}
					throw new Error( 'server' );
				} )
				.catch( showServerError )
				.then( function () {
					submit.disabled = false;
					submit.textContent = submit.dataset.label;
				} );
		} );
	} )();

	/* ---------- Click tracking ---------- */
	document.addEventListener( 'click', function ( e ) {
		var a = e.target.closest && e.target.closest( 'a' );
		if ( ! a ) { return; }
		var explicit = a.getAttribute( 'data-track' );
		if ( explicit ) {
			track( explicit, { link_url: a.href, link_text: a.textContent.trim() } );
			return;
		}
		if ( a.protocol === 'tel:' ) {
			track( 'hm_phone_click', { link_url: a.href } );
		} else if ( a.host && a.host !== window.location.host && /^https?:$/.test( a.protocol ) ) {
			var host = a.hostname.replace( /^www\./, '' );
			track( mainSiteHost && host === mainSiteHost.replace( /^www\./, '' ) ? 'hm_main_site_click' : 'hm_outbound_click', { link_url: a.href } );
		}
	} );

	/* ---------- Cookie banner ---------- */
	( function () {
		var banner = document.getElementById( 'hm-cookie' );
		if ( ! banner ) { return; }
		var choice = null;
		try { choice = window.localStorage.getItem( 'hm_consent' ); } catch ( err ) {}
		if ( choice ) { return; }
		banner.hidden = false;
		banner.addEventListener( 'click', function ( e ) {
			var btn = e.target.closest( '[data-consent]' );
			if ( ! btn ) { return; }
			var value = btn.getAttribute( 'data-consent' );
			try { window.localStorage.setItem( 'hm_consent', value ); } catch ( err ) {}
			if ( value === 'granted' && typeof window.gtag === 'function' ) {
				window.gtag( 'consent', 'update', { analytics_storage: 'granted', ad_storage: 'granted', ad_user_data: 'granted', ad_personalization: 'granted' } );
			}
			banner.hidden = true;
		} );
	} )();
} )();
