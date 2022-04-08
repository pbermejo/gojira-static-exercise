(function() {
	
	// TOGGLE MENU
	const menuToggle = document.querySelector(".navbar-burger");
	const menu = document.querySelector(".navbar-menu")
	menuToggle.addEventListener("click", onMenuToggle, false);

	function onMenuToggle() {
		let expanded = this.getAttribute("aria-expanded");
		expanded = eval(expanded);
		this.attributes["aria-expanded"] = !expanded;
		this.setAttribute("aria-expanded", !expanded);
		menu.classList.toggle("is-expanded", !expanded);
	}

	// SCROLL OBSERVER
	if(!!window.IntersectionObserver){
		const header = document.querySelector('header');
		const target = document.querySelector('h1');
		const options = {
			rootMargin: "-150px 0px 0px 0px"
		}		
		const handler = (entries) => {
			if (!entries[0].isIntersecting) {
				header.classList.add('is-opaque');
			} else {
				header.classList.remove('is-opaque');
			}
		}
		const observer = new window.IntersectionObserver(handler,options);
		observer.observe(target);
	}
})();