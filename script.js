const upload = document.getElementById("upload")
const topText = document.getElementById("topText")
const bottomText = document.getElementById("bottomText")
const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")
const historyDiv = document.getElementById("history")
const rouletteDiv = document.getElementById("roulette")
const topMemesDiv = document.getElementById("topMemes")
const nicknameInput = document.getElementById("nickname")
const authSection = document.getElementById("authSection")
const mainSite = document.getElementById("mainSite")
const registerBtn = document.getElementById("registerBtn")

let image = new Image()

function registerUser() {
  const nick = document.getElementById("regNick").value.trim()
  const pass = document.getElementById("regPass").value.trim()
  const email = document.getElementById("regEmail").value.trim()

  if (!nick || !pass || !email) {
    alert("Заповни всі поля!")
    return
  }

  const users = JSON.parse(localStorage.getItem("datauser") || "[]")
  users.push({
    nick,
    pass,
    email,
    date: new Date().toISOString()
  })
  localStorage.setItem("datauser", JSON.stringify(users))

  registerBtn.style.display = "none"
  authSection.style.display = "none"
  mainSite.style.display = "block"

  showHistory()
  startRoulette()
  showTopMemes()
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

document.getElementById("downloadMeme").addEventListener("click", () => {
  const link = document.createElement("a")
  link.download = "meme.png"
  link.href = canvas.toDataURL("image/png")
  link.click()
})

canvas.addEventListener("click", () => {
  const modal = document.getElementById("modal")
  const modalImg = document.getElementById("modalImg")
  modalImg.src = canvas.toDataURL()
  modal.style.display = "flex"
})

function closeModal() {
  document.getElementById("modal").style.display = "none"
}

function setUsername() {
  const nick = nicknameInput.value.trim()
  if (nick !== "") {
    localStorage.setItem("username", nick)
    alert("Нік збережено: " + nick)
  }
}

function rateMeme(text) {
  let score = 0
  const keywords = ["котик", "пиво",]
