
    "env": {
      "browser": true,
      "es2021": true
  },
  "extends": [
      "eslint:recommended",
      "plugin:react/recommended"
  ],
  "parserOptions": {
      "ecmaFeatures": {
          "jsx": true
      },
      "ecmaVersion": "latest",
      "sourceType": "module"
  },
  "plugins": [
      "react"
  ],
  "rules": {
      "react/prop-types": 0,
      "react/jsx-key": 0,
      "no-console": 1,
      "no-unused-vars": 0
  }
}
