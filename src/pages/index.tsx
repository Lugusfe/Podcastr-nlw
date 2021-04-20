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
  const response = await fetch('http://localhost:3333/episodes')
  const data = await response.json()
  console.log(data)

  return {
    props: {
      episodes: data,
    },
    revalidate: 60 * 60 * 8,
  }
  
}
