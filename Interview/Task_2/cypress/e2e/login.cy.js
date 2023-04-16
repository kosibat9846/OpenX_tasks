import LoginPage from "../pages/login_spec";

const correctPassword = 'pwd'
const incorrectPassword = 'wrongPwd'

const loginPage = new LoginPage();

describe('Succesfull login', () => {
    beforeEach(() => {
        loginPage.visit()
      })

    afterEach(() => {
        loginPage.clickLogOutButton()
        loginPage.containsSuccessfulLoggedOutStatus()
      })

    const providedUserNames = [
        generateRandomAlphabetic(),
        '1234444',
        `!@#$%&*())){}|`,
        generateRandomAlphabetic() + '1234',
        generateRandomAlphabetic() + '!@#$%&',
        '${' + generateRandomAlphabetic() + '}',
        '${' + generateRandomAlphabetic() + '123}',
    ]

    providedUserNames.forEach(($type) => {
        const providedUserName = $type

        it('User should be able to login with user name ${providedUserNames}',  () => {
            // When
            loginPage.elements.usernameInput().type(providedUserName, {
                force: true, parseSpecialCharSequences: false,
              })
            loginPage.typePassword(correctPassword)
            loginPage.clickLogInButton()
      
            // Then
            loginPage.containsSuccessfulLoggedInStatus(providedUserName)
          });
      })

    const providedUserNamesWithWhitespaces = [
        [' ', ''],
        ['       ', ''],
        [' abcd', 'abcd'],
        ['abcd ', 'abcd '],
        ['       abcd   ', `abcd `]
    ]

    providedUserNamesWithWhitespaces.forEach(($type) => {
        const [providedUserNameWithWhitespaces, expectedUserNameAtLoginStatusMessage] = $type

        it('User should be able to login with user name with white spaces  ${providedUserNameWithWhitespaces}',  () => {
            // When
            loginPage.login(providedUserNameWithWhitespaces, correctPassword)
      
            // Then
            loginPage.containsSuccessfulLoggedInStatus(expectedUserNameAtLoginStatusMessage)
          });
      })
});

describe('Unsuccessful login', () => {
    beforeEach(() => {
        loginPage.visit()
      })


    it('User should not be able to login with wrong password',  () => {    
        // When
        loginPage.login(generateRandomAlphabetic(), incorrectPassword)

        // Then
        loginPage.containsUnsuccessfulLoginStatus()
      });

    it('User should not be able to login without login and password',  () => {    
        // When
        loginPage.clickLogInButton()

        // Then
        loginPage.containsUnsuccessfulLoginStatus()
      });

    it('User should not be able to login without password',  () => {    
        // When
        loginPage.typeUsername(generateRandomAlphabetic())
        loginPage.clickLogInButton()

        // Then
        loginPage.containsUnsuccessfulLoginStatus()
      });

    it('User should not be able to login without user name',  () => {    
        // When
        loginPage.typePassword(correctPassword)
        loginPage.clickLogInButton()

        // Then
        loginPage.containsUnsuccessfulLoginStatus()
      });
});

describe('Succesfull log out', () => {
  beforeEach(() => {
      loginPage.visit()
      loginPage.login(generateRandomAlphabetic(), correctPassword)
    })

    it('Should log out user with success after click log out button',  () => {
        // When
        loginPage.clickLogOutButton()

        // Then
        loginPage.containsSuccessfulLoggedOutStatus()
      });

    it('Should log out user when page reload',  () => {
        // When
        loginPage.visit()

        // Then
        loginPage.containsSuccessfulLoggedOutStatus()
      });

    it('Should log out user when page reload with cache',  () => {
        // When
        cy.reload()

        // Then
        loginPage.containsSuccessfulLoggedOutStatus()
      });

    it('Should log out user when page reload without cache',  () => {
        // When
        cy.reload(true)

        // Then
        loginPage.containsSuccessfulLoggedOutStatus()
      });
});

function generateRandomAlphabetic() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    for (var i = 0; i < 10; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }