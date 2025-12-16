import { registerExamples } from './register'

const files = import.meta.glob('./items/*.ts', { eager: true })
const examples = Object.values(files).map((module) => module)
