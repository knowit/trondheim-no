
const letters = [
  ' ', 'Æ', 'Ø', 'Å', 'æ', 'ø', 'å', '+'

]

letters.map(letter => {
  console.log({
    original: letter,
    encodeURI: encodeURI(letter),
    encodeURIComponent: encodeURIComponent(letter)
  })
})

