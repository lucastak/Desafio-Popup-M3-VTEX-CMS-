class InstagramGallery {
	constructor({ gallery, account, limit }) {
		this.options = {
			gallery: $(gallery),
			account,
			limit,
		};

		this.getPosts().then((data) => {
			this.buildGallery(data);
		});
	}

	async getPosts() {
		const url = `https://www.instagram.com/${this.options.account}/?__a=1`;

		let data;
		let status;

		try {
			data = await (await fetch(url)).json();
			status = "success";
		} catch (error) {
			data = { message: "Ocorreu um erro ao carregar as imagens." };
			status = "error";
		}

		return { data, status };
	}

	buildGallery({ data, status }) {
		if (status === "success") {
			const posts = data.graphql.user.edge_owner_to_timeline_media.edges;

			for (let i = 0; i < this.options.limit; i++) {
				if (!posts[i]) break;

				const post = posts[i].node;
				const caption = post.edge_media_to_caption.edges[0]?.node.text;

				const galleryItem = `
					<a
						class="instagramGallery__photo"
						href="https://www.instagram.com/p/${post.shortcode}"
						title="${caption || ""}"
						target="_blank"
						style="background-image: url(${post.thumbnail_src})"
					>
				`;

				this.options.gallery.append(galleryItem);
			}
		} else {
			this.options.gallery.append(
				`<p class="instagramGallery__error">${data.message}</p>`
			);
		}
	}
}

export default InstagramGallery;
