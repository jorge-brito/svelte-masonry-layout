<script context="module" lang="ts">
	import { onMount, afterUpdate } from 'svelte';
	export type MasonryColumns = {
		default?: string | number;
		[key: string | number]: string | number;
	};

	type Styles = Record<string, unknown>;

	const setStyles = (node: HTMLElement, styles: Styles): void => {
		for (const key in styles) {
			const value = styles[key];
			if (value) node.style.setProperty('--' + key, value.toString());
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

	const debounce = <T extends (...args: any[]) => any>(callback: T, interval: number): T => {
		let then = Date.now();

		return ((...params: any[]) => {
			const now = Date.now();
			if (now - then > interval) {
				callback(...params);
				then = now;
			}
		}) as T;
	};
</script>

<script lang="ts">
	export let items = [] as unknown[];
	export let gap = '10px';
	export let updateInterval = 300;
	export let columns = 'repeat(auto-fill, minmax(250px, 1fr))';
	export let width: string = null;
	export let height: string = null;
	export let breakpointCols = null as MasonryColumns;
	export let columnWidth = 0;
	export { className as class };

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
					grid.style.gridTemplateColumns = breakpointCols.default
						? `repeat(${breakpointCols.default}, 1fr)`
						: columns;
				}
			}
		}
	};

	export const updateGrid = (items?: unknown) => {
		if (grid) {
			updateGridWidth();
			columnWidth = parseFloat(getComputedStyle(grid).gridTemplateColumns);
			rowGap = parseInt(getComputedStyle(grid).rowGap);
			const allItems = Array.from(grid.children);
			allItems.forEach(resizeItem);
		}
	};

	afterUpdate(updateGrid);
	onMount(updateGrid);

	const onResize = debounce(updateGrid, updateInterval);
</script>

<svelte:window on:resize={onResize} />

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
	<slot {updateGrid} {columnWidth} {items} />
</div>

<style>
	.masonry-grid {
		display: grid;
		gap: var(--gap);
		grid-template-columns: var(--columns);
		grid-auto-rows: 0;
		width: var(--width);
		height: var(--height);
	}
</style>
