import { useEffect } from "react"


export default function Home(props) {
  // useEffect(() =>{
  //   fetch('http://localhost:3333/episodes')
  //     .then(response => response.json())
  //     .then(data => console.log(data))
  // }, [])

  console.log(props.episodes)
  return (
    <h1>Oiiiii</h1>
  )
}

export async function getStaticProps(){
  const response = await fetch('https://s3.us-west-2.amazonaws.com/secure.notion-static.com/c4ea48b9-25ef-4267-aa02-f4815e2a3459/server.json?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAT73L2G45O3KS52Y5%2F20210420%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20210420T160207Z&X-Amz-Expires=86400&X-Amz-Signature=e444b787c3484946a99dd06219e970fc753524e959e09ff42c41344fee512ef6&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22server.json%22')
  const data = await response.json()
  return {
    props: {
      episodes: data,
    },
    revalidate: 60 * 60 * 8,
  }
  
}
