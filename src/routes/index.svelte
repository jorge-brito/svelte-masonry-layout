<script lang="ts">
	import { MasonryLayout } from 'svelte-masonry-layout';
	import { rand, range } from '@utils';

	const itemCount = 30;
	let columnWidth: number = 0;

	const randomItem = () => ({
		height: rand(400, 100),
		hue: rand(360)
	});

	let items = range(itemCount, randomItem);

	const loadMoreItems = (size: number) => {
		items = [...items, ...range(size, randomItem)];
	};

	const scroll = () => {
		const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
		if (scrollTop == scrollHeight - clientHeight) {
			if (items.length <= 100) {
				loadMoreItems(10);
			}
		}
	};

	$: console.log({ columnWidth });
</script>

<svelte:window on:scroll={scroll} />

<MasonryLayout
	gap="1px"
	{items}
	bind:columnWidth
	breakpointCols={{
		default: 6,
		500: 2,
		700: 3,
		900: 4,
		1200: 5
	}}
>
	{#each items as item}
		<div class="item" style="--hue: {item.hue}; --h: {item.height}px" />
	{/each}
</MasonryLayout>

<style>
	:global(html, body) {
		box-sizing: border-box;
		padding: 0;
		margin: 0;
		padding: 1rem;
	}

	.item {
		--color: hsl(var(--hue), 70%, 60%);
		display: flex;
		position: relative;
		height: var(--h);
		width: 100%;
		border-radius: 10px;
	}

	.item::before {
		content: '';
		width: 100%;
		height: 100%;
		background: var(--color);
	}

	.item::after {
		content: '';
		position: absolute;
		top: 0;
		right: 0;
		width: 10px;
		height: 100%;
		background: hsl(var(--hue), 70%, 54%);
		opacity: 0.8;
	}
</style>
