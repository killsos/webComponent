class UserCard extends HTMLElement {
	constructor() {
		super();
		this.addEventListener('click', e => {
			this.toggleCard();
		})
	}
	
	connectedCallback() {
	var currentDocument = document.currentScript.ownerDocument;

  // Called when element is inserted in DOM
  const shadowRoot = this.attachShadow({mode: 'open'});

  // Select the template and clone it. 
	// Finally attach the cloned node to the shadowDOM's root.
  // Current document needs to be defined to get DOM access to imported HTML
  const template = currentDocument.querySelector('#test');
	
  const instance = template.content.cloneNode(true);
		
  shadowRoot.appendChild(instance);
  // Extract the attribute user-id from our element. 
  // Note that we are going to specify our cards like: 
  // <user-card user-id="1"></user-card>
  const userId = this.getAttribute('user-id');

  // Fetch the data for that user Id from the API and call the render method with this data
  fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)
      .then((response) => response.text())
      .then((responseText) => {
          this.render(JSON.parse(responseText));
      })
      .catch((error) => {
          console.error(error);
      });
	}
	
	render(userData) {
		// Fill the respective areas of the card using DOM manipulation APIs
		// All of our components elements reside under shadow dom. So we created a this.shadowRoot property
		// We use this property to call selectors so that the DOM is searched only under this subtree
		this.shadowRoot.querySelector('.card_full_name').innerHTML = userData.name;
		//this.shadowRoot.querySelector('.card_user_name').innerHTML = userData.username;
    this.shadowRoot.querySelector('.card_website').innerHTML = userData.website;
		this.shadowRoot.querySelector('.card_address').innerHTML = `<h4>Address</h4>
			${userData.address.suite}, <br />
			${userData.address.street},<br />
			${userData.address.city},<br />
			Zipcode: ${userData.address.zipcode}`
	}

	toggleCard() {
		let elem = this.shadowRoot.querySelector('.card_hidden-content');
		let btn = this.shadowRoot.querySelector('.card_details-btn');
		btn.innerHTML = elem.style.display == 'none' ? 'Less Details' : 'More Details';
		elem.style.display = elem.style.display == 'none' ? 'block' : 'none';
	}
}

customElements.define('user-card', UserCard);
