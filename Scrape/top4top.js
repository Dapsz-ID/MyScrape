const fs = require('fs')
const axios = require('axios')
const FormData = require('form-data')

async function top4top(file){
  const f=new FormData()
  f.append('file_0_',fs.createReadStream(file),file.split('/').pop())
  f.append('submitr','[ رفع الملفات ]')

  const html = await axios.post(
    'https://top4top.io/index.php',
    f,
    {
      headers:{
        ...f.getHeaders(),
        'User-Agent':'Mozilla/5.0 (Linux; Android 10)',
        'Accept':'text/html'
      }
    }
  ).then(x=>x.data).catch(()=>null)

  if(!html)return{status:'error'}

  const get=re=>{
    const m=html.match(re)
    return m?m[1]:null
  }

  const result=
    get(/value="(https:\/\/[a-z]\.top4top\.io\/m_[^"]+)"/)||
    get(/https:\/\/[a-z]\.top4top\.io\/m_[^"]+/)||
    get(/value="(https:\/\/[a-z]\.top4top\.io\/p_[^"]+)"/)||
    get(/https:\/\/[a-z]\.top4top\.io\/p_[^"]+/)

  const del=
    get(/value="(https:\/\/top4top\.io\/del[^"]+)"/)||
    get(/https:\/\/top4top\.io\/del[^"]+/)

  return{
    result,
    delete:del
  }
}

const result = await top4top('./audio/ghost.mp3')
return result
