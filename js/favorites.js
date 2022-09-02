
import { GithubUser } from "./gitHubUser.js"

export class Favorites{
  constructor(root){
    this.root = document.querySelector(root)
    this.load()
  }
  load(user){
    this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
    
  }
  save(){
    localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
  }
  async add(userName){
    try {
      const userExist = this.entries.find(entry => entry.login === userName)
      if(userExist){
        throw new Error('Usuário já cadastrado')
      }

      const user = await GithubUser.search(userName)
      
      if(user.login === undefined){
        throw new Error('Usuário não encontrado')
      }
      this.entries = [user, ...this.entries]
      this.update()
      this.save()
    } catch(error){
      alert(error.message)
    }  
  }
  delete(user){
    const filteredEntries = this.entries.filter(entry => entry.login !== user.login)
    this.entries = filteredEntries
    
    this.update()
    this.save()
  }
}

export class FavoritesView extends Favorites{
  constructor(root){
    super(root)
    this.tbody = this.root.querySelector('table tbody')
    
    this.update()
    this.onAdd()
  }
  onAdd(){
    const addButton = this.root.querySelector('.search button')
    addButton.onclick = () => {
      const inputEntry = this.root.querySelector('.search input')
      const {value} = inputEntry
      this.add(value)
      inputEntry.value = ""
      inputEntry.focus()
    }
  }
  update(){
    this.removeAllTr()
    
    
    this.entries.forEach(user => {
      const row = this.createRow()
      row.querySelector('.user img').src = `https://github.com/${user.login}.png`
      row.querySelector('.user img').alt = `Imagem de ${user.name}`
      row.querySelector('p').textContent = user.name
      row.querySelector('a').href = `https://github.com/${user.login}`
      row.querySelector('span').textContent = user.login
      row.querySelector('.repositories').textContent = user.public_repos
      row.querySelector('.followers').textContent = user.followers
      row.querySelector('.remove').onclick = () => {
        const isOk = confirm(`Tem certeza que deseja deletar o ${user.name}?`)
        if(isOk){
          this.delete(user)
        }
      }
      this.tbody.append(row)
    })
    
  }
  createRow(){
    const tr = document.createElement('tr')
    tr.innerHTML = `
          <td class="user">
            <img src="https://github.com/gabrielStertz.png" alt="Imagem do usuário pesquisado">
            <a href="https://github.com/gabrielStertz" target="_blank">
              <p></p>
              <span></span>
            </a>
          </td>
          <td class="repositories"></td>
          <td class="followers"></td>
          <td>
            <button class="remove">&times;</button>
          </td>
          `
    return tr      
  }
  removeAllTr(){
    
    this.tbody.querySelectorAll('tr').forEach((tr) => {
      tr.remove()
    })
  }
}