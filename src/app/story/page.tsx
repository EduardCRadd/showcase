import { Story } from '@/components/story/Story'

import styles from './story.module.scss'

// F1 Story (UK - always on)

export default function StoryPage() {
  return (
    <main className={styles.main}>
      <Story />
    </main>
  )
}
