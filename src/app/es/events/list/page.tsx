'use client'

import ListItems from '@/components/events/list/ListItems'

import styles from './list.module.scss'

// B3 - List
const ListTab = () => {
  return (
    <main id="container" className={styles.main}>
      <ListItems />
    </main>
  )
}

export default ListTab
