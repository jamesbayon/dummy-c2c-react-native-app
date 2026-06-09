/* eslint-env detox/detox, jest */
/* Page objects (screen helpers). Each screen exposes element accessors and
 * intent-revealing actions so specs stay readable and selectors stay in one
 * place. All selectors are stable testIDs. */

const DEFAULT_TIMEOUT = 10000;

const LoginScreen = {
  email: () => element(by.id('email-input')),
  password: () => element(by.id('password-input')),
  submitButton: () => element(by.id('login-button')),
  errorMessage: () => element(by.id('login-error-message')),
  signUpLink: () => element(by.id('go-to-register-button')),

  async assertVisible() {
    await waitFor(this.submitButton())
      .toBeVisible()
      .withTimeout(DEFAULT_TIMEOUT);
  },
  async typeCredentials(email, password) {
    await this.email().replaceText(email);
    await this.password().replaceText(password);
  },
  async submit() {
    await this.submitButton().tap();
  },
  async login(email, password) {
    await this.typeCredentials(email, password);
    await this.submit();
  },
  async goToRegister() {
    await this.signUpLink().tap();
  },
};

const RegisterScreen = {
  name: () => element(by.id('register-name-input')),
  email: () => element(by.id('register-email-input')),
  password: () => element(by.id('register-password-input')),
  confirmPassword: () => element(by.id('register-confirm-password-input')),
  bio: () => element(by.id('register-bio-input')),
  submitButton: () => element(by.id('register-submit-button')),
  errorMessage: () => element(by.id('register-error-message')),
  logInLink: () => element(by.id('go-to-login-button')),

  async assertVisible() {
    await waitFor(this.submitButton())
      .toBeVisible()
      .withTimeout(DEFAULT_TIMEOUT);
  },
  // fields: {name, email, password, confirmPassword, bio}
  async fill(fields) {
    if (fields.name !== undefined) {
      await this.name().replaceText(fields.name);
    }
    if (fields.email !== undefined) {
      await this.email().replaceText(fields.email);
    }
    if (fields.password !== undefined) {
      await this.password().replaceText(fields.password);
    }
    if (fields.confirmPassword !== undefined) {
      await this.confirmPassword().replaceText(fields.confirmPassword);
    }
    if (fields.bio !== undefined) {
      await this.bio().replaceText(fields.bio);
    }
  },
  async submit() {
    // Submit sits below the fold once the keyboard is up; scroll it into view.
    await waitFor(this.submitButton())
      .toBeVisible()
      .whileElement(by.id('register-scroll'))
      .scroll(250, 'down');
    await this.submitButton().tap();
  },
};

const TabBar = {
  home: () => element(by.id('tab-home')),
  sell: () => element(by.id('tab-sell')),
  favorites: () => element(by.id('tab-favorites')),
  profile: () => element(by.id('tab-profile')),

  async assertVisible() {
    await waitFor(this.home()).toBeVisible().withTimeout(DEFAULT_TIMEOUT);
  },
  async goHome() {
    await this.home().tap();
  },
  async goSell() {
    await this.sell().tap();
  },
  async goFavorites() {
    await this.favorites().tap();
  },
  async goProfile() {
    await this.profile().tap();
  },
};

const ListingsScreen = {
  list: () => element(by.id('listings-list')),
  searchInput: () => element(by.id('search-input')),
  emptyMessage: () => element(by.id('empty-search-message')),
  card: id => element(by.id(`listing-card-${id}`)),
  title: id => element(by.id(`listing-title-${id}`)),
  price: id => element(by.id(`listing-price-${id}`)),
  cardByTitle: title => element(by.text(title)),
  favoriteButton: id => element(by.id(`favorite-button-${id}`)),
  soldBadge: id => element(by.id(`sold-badge-${id}`)),

  // Keyboard-safe "we are authenticated and on Home" check: the search bar sits
  // at the top of the screen, so it stays visible even if the soft keyboard is
  // still dismissing over the bottom tab bar after a login submit.
  async assertLoaded() {
    await waitFor(this.searchInput())
      .toBeVisible()
      .withTimeout(DEFAULT_TIMEOUT);
  },
  async search(query) {
    await this.searchInput().replaceText(query);
  },
  async clearSearch() {
    await this.searchInput().clearText();
  },
  async openCard(id) {
    await this.card(id).tap();
  },
  async toggleFavorite(id) {
    await this.favoriteButton(id).tap();
  },
};

const ProductDetailScreen = {
  title: () => element(by.id('product-title')),
  price: () => element(by.id('product-price')),
  condition: () => element(by.id('product-condition')),
  soldBanner: () => element(by.id('product-sold-banner')),
  favoriteButton: () => element(by.id('favorite-button')),
  sellerRow: () => element(by.id('product-seller-row')),
  sellerName: () => element(by.id('product-seller-name')),
  viewSellerButton: () => element(by.id('view-seller-button')),

  async assertVisible() {
    await waitFor(this.title()).toBeVisible().withTimeout(DEFAULT_TIMEOUT);
  },
  async toggleFavorite() {
    await this.favoriteButton().tap();
  },
  async openSeller() {
    await this.sellerRow().tap();
  },
};

const CreateListingScreen = {
  scroll: () => element(by.id('create-listing-scroll')),
  title: () => element(by.id('listing-title-input')),
  price: () => element(by.id('listing-price-input')),
  categoryOption: c => element(by.id(`category-option-${c}`)),
  conditionOption: c => element(by.id(`condition-option-${c}`)),
  description: () => element(by.id('listing-description-input')),
  submitButton: () => element(by.id('listing-submit-button')),
  titleError: () => element(by.id('listing-title-error')),
  priceError: () => element(by.id('listing-price-error')),
  categoryError: () => element(by.id('listing-category-error')),
  conditionError: () => element(by.id('listing-condition-error')),

  async assertVisible() {
    await waitFor(this.title()).toBeVisible().withTimeout(DEFAULT_TIMEOUT);
  },
  // fields: {title, price, category, condition, description}
  async fill(fields) {
    if (fields.title !== undefined) {
      await this.title().replaceText(fields.title);
    }
    if (fields.price !== undefined) {
      await this.price().replaceText(fields.price);
    }
    if (fields.category !== undefined) {
      await this.categoryOption(fields.category).tap();
    }
    if (fields.condition !== undefined) {
      await this.conditionOption(fields.condition).tap();
    }
    if (fields.description !== undefined) {
      await this.description().replaceText(fields.description);
    }
  },
  async submit() {
    // Submit button sits below the fold; scroll it into view first.
    await waitFor(this.submitButton())
      .toBeVisible()
      .whileElement(by.id('create-listing-scroll'))
      .scroll(250, 'down');
    await this.submitButton().tap();
  },
};

const FavoritesScreen = {
  emptyMessage: () => element(by.id('empty-favorites-message')),
  card: id => element(by.id(`listing-card-${id}`)),
  title: id => element(by.id(`listing-title-${id}`)),
};

const SellerProfileScreen = {
  name: () => element(by.id('seller-name')),
  joinedDate: () => element(by.id('seller-joined-date')),
  bio: () => element(by.id('seller-bio')),
  card: id => element(by.id(`listing-card-${id}`)),

  async assertVisible() {
    await waitFor(this.name()).toBeVisible().withTimeout(DEFAULT_TIMEOUT);
  },
};

const ProfileScreen = {
  name: () => element(by.id('profile-name')),
  email: () => element(by.id('profile-email')),
  joinedDate: () => element(by.id('profile-joined-date')),
  bio: () => element(by.id('profile-bio')),
  logoutButton: () => element(by.id('logout-button')),

  async assertVisible() {
    await waitFor(this.logoutButton())
      .toBeVisible()
      .withTimeout(DEFAULT_TIMEOUT);
  },
  async logout() {
    await this.logoutButton().tap();
  },
};

module.exports = {
  DEFAULT_TIMEOUT,
  LoginScreen,
  RegisterScreen,
  TabBar,
  ListingsScreen,
  ProductDetailScreen,
  CreateListingScreen,
  FavoritesScreen,
  SellerProfileScreen,
  ProfileScreen,
};
