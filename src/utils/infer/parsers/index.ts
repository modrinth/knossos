import { fabric } from './fabric'
import { quilt } from './quilt'
import { forge } from './forge'

export const parsers = {
	'fabric.mod.json': fabric,
	'quilt.mod.json': quilt,
	'META-INF/mods.toml': forge,
}
