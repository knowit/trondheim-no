import { graphql } from "gatsby"

export const getLocalWord = (localizationArray, key, locale) => {
  for (let i = 0; i < localizationArray.length; i++) {
    if (localizationArray[i].key.toLowerCase() === key.toLowerCase()) {
      for (let j = 0; j < localizationArray[i].translations.length; j++) {
        const element = localizationArray[i].translations[j]
        if (element.language.toLowerCase() === locale.toLowerCase()) {
          return element.word
        }
      }
    }
  }
  return "Word not found"
}

export const _fragment = graphql`
  fragment LocalizationFragment on LocalizationContent {
    translations {
      key
      translations {
        language
        word
      }
    }
  }
`
