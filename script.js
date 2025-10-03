const upload = document.getElementById("upload")
const topText = document.getElementById("topText")
const bottomText = document.getElementById("bottomText")
const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")
const historyDiv = document.getElementById("history")
const rouletteDiv = document.getElementById("roulette")
const topMemesDiv = document.getElementById("topMemes")
const nicknameInput = document.getElementById("nickname")

let image = new Image()

function startVerification() {
  const nick = document.getElementById("regNick").value.trim()
  const pass = document.getElementById("regPass").value.trim()
  const email = document.getElementById("regEmail").value.trim()

  if (!nick || !pass || !email) {
    alert("Заповни всі поля!")
    return
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString()
  localStorage.setItem("verifyCode", code)
  localStorage.setItem("tempUser", JSON.stringify({ nick, pass, email }))
  alert("Код підтвердження: " + code)
  document.getElementById("verifyBlock").style.display = "block"
}

function confirmCode() {
  const inputCode = document.getElementById("verifyCode").value.trim()
  const realCode = localStorage.getItem("verifyCode")
  const userData = JSON.parse(localStorage.getItem("tempUser"))

  if (inputCode === realCode) {
    const users = JSON.parse(localStorage.getItem("datauser") || "[]")
    users.push({
      nick: userData.nick,
      pass: userData.pass,
      email: userData.email,
      date: new Date().toISOString()
    })
    localStorage.setItem("datauser", JSON.stringify(users))
    alert("Реєстрація успішна!")
    localStorage.removeItem("verifyCode")
    localStorage.removeItem("tempUser")
    document.getElementById("verifyBlock").style.display = "none"
  } else {
    alert("Невірний код!")
  }
}

upload.addEventListener("change", (e) => {
  const file = e.target.files[0]
  const reader = new FileReader()
  reader.onload = () => {
    image.src = reader.result
    image.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
    }
  }
  reader.readAsDataURL(file)
})

document.getElementById("generate").addEventListener("click", () => {
  if (!image.src) {
    alert("Завантаж фото!")
    return
  }

  ctx.drawImage(image, 0, 0, canvas.width, canvas.height)

  ctx.font = "30px Impact"
  ctx.fillStyle = "white"
  ctx.strokeStyle = "black"
  ctx.lineWidth = 2
  ctx.textAlign = "center"

  ctx.fillText(topText.value.toUpperCase(), canvas.width / 2, 40)
  ctx.strokeText(topText.value.toUpperCase(), canvas.width / 2, 40)

  ctx.fillText(bottomText.value.toUpperCase(), canvas.width / 2, canvas.height - 20)
  ctx.strokeText(bottomText.value.toUpperCase(), canvas.width / 2, canvas.height - 20)

  const memeData = canvas.toDataURL()
  saveMeme(memeData)
  showHistory()
  showTopMemes()
})

function setUsername() {
  const nick = nicknameInput.value.trim()
  if (nick !== "") {
    localStorage.setItem("username", nick)
    alert("Нік збережено: " + nick)
  }
}

function rateMeme(text) {
  let score = 0
  const keywords = ["котик", "пиво", "школа", "баба", "дупа", "пес", "жиза", "прикол", "мем"]
  keywords.forEach(word => {
    if (text.toLowerCase().includes(word)) score += 2
  })
  score += Math.floor(Math.random() * 5)
  return Math.min(score, 10)
}

function saveMeme(dataUrl) {
  const memes = JSON.parse(localStorage.getItem("memes") || "[]")
  const score = rateMeme(topText.value + " " + bottomText.value)
  const username = localStorage.getItem("username") || "Гість"
  memes.push({ url: dataUrl, date: new Date().toISOString(), score, username })
  localStorage.setItem("memes", JSON.stringify(memes))
}

function showHistory() {
  historyDiv.innerHTML = ""
  const memes = JSON.parse(localStorage.getItem("memes") || "[]")
  memes.forEach(meme => {
    const img = document.createElement("img")
    img.src = meme.url
    historyDiv.appendChild(img)
  })
}

function startRoulette() {
  const memes = JSON.parse(localStorage.getItem("memes") || "[]")
  let index = 0
  setInterval(() => {
    rouletteDiv.innerHTML = ""
    if (memes.length > 0) {
      const img = document.createElement("img")
      img.src = memes[index % memes.length].url
      rouletteDiv.appendChild(img)
      index++
    }
  }, 3000)
}
