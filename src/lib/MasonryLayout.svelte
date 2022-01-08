<script context="module" lang="ts">
	import { onMount, afterUpdate } from 'svelte';
	export type MasonryColumns = Record<number, number>;

	type Styles = Record<string, unknown>;

	const setStyles = (node: HTMLElement, styles: Styles): void => {
		for (const key in styles) {
			const value = styles[key].toString();
			node.style.setProperty('--' + key, value);
		}
	};

	const styles = (node: HTMLElement, styles: Styles): unknown => {
		setStyles(node, styles);
		return {
			update(newStyles: Styles) {
				setStyles(node, newStyles);
			}
		};
	};
</script>

<script lang="ts">
	export let items = [] as unknown[];
	export let gap = '10px';
	export let columns = 'repeat(auto-fill, minmax(250px, 1fr))';
	export let width = '100%';
	export let height = '100%';
	export let breakpointCols = null as MasonryColumns;
	export { className as class };

	items && {};

	let grid: HTMLDivElement = null;
	let className = '';
	let rowGap = 0;

	const resizeItem = (item: HTMLElement) => {
		const height = item.getBoundingClientRect().height;
		const rowSpan = Math.ceil((height + rowGap) / rowGap);
		item.style.gridRowEnd = 'span ' + rowSpan;
	};

	const updateGridWidth = () => {
		if (breakpointCols) {
			const windowWidth = (window && window.innerWidth) || Infinity;
			for (const key in breakpointCols) {
				const bp = parseInt(key);
				const cols = breakpointCols[key];
				const isCurrentBreakpoint = bp > 0 && windowWidth <= bp;
				if (isCurrentBreakpoint) {
					grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
					break;
				} else {
					grid.style.gridTemplateColumns = columns;
				}
			}
		}
	};

	export const updateGrid = (items?: unknown) => {
		if (grid) {
			updateGridWidth();
			rowGap = parseInt(getComputedStyle(grid).rowGap);
			const allItems = Array.from(grid.children);
			allItems.forEach(resizeItem);
		}
	};

	afterUpdate(updateGrid);
	onMount(updateGrid);
</script>

<svelte:window on:resize={updateGrid} />

<div
	class="masonry-grid {className}"
	bind:this={grid}
	use:styles={{
		columns,
		width,
		height,
		gap
	}}
>
	<slot {updateGrid} />
</div>

<style>
	.masonry-grid {
		display: grid;
		gap: var(--gap);
		grid-template-columns: var(--columns);
		grid-auto-rows: 0;
		width: var(--width);
		height: var(--height);
		overflow: auto;
	}
</style>
