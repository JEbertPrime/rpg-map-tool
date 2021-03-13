import Head from 'next/head'
import styles from '../styles/Home.module.css'
import SvgBox from '../Components/SvgBox.jsx' 
import {Input, Label} from 'reactstrap'
import { useState } from 'react'
export default function Home() {
  var [radius, changeRadius] = useState(10)
  return (
    <div className={styles.container}>
      <SvgBox radius={radius} width={700}/>
      <Label>{radius}</Label>
      <Input type='range' onChange={(e)=>changeRadius(+e.target.value)} step={.5}max={40} min={10}/>
    </div>
  )
}
