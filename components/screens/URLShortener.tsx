import {Button} from "components/atoms/Button";
import {Input} from "components/atoms/Input";
import {useState} from "react";
import {SubmitHandler, useForm} from "react-hook-form";

type URLShortenerForm = {
	url: string;
};

export const URLShortener = () => {
	const [shortenedUrl, setShortenedUrl] = useState("");
	const [loading, setLoading] = useState(false);
	const onSubmit: SubmitHandler<URLShortenerForm> = (data) => {
		setLoading(true);
		setTimeout(() => {
			setShortenedUrl(data.url);
			setLoading(false);
		}, 2000);
	};
	const {
		register,
		handleSubmit,
		formState: {errors},
	} = useForm<URLShortenerForm>();

	return (
		<div className="solid rounded-lg border p-4">
			<h1 className="mb-2 text-3xl">URL Shortener</h1>
			<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
				<Input
					placeholder="https://..."
					{...register("url", {required: true})}
				/>
				<Button
					text="Generate"
					variant="filled"
					className="max-w-fit self-end"
					type="submit"
					loading={loading}
				/>
			</form>
			<p className="text-red-400">
				{errors.url && "Vui lòng nhập URL để tiếp tục"}
			</p>
			{shortenedUrl && (
				<div className="mt-4">
					<h3>Rút gọn link thành công!</h3>
					<p className="mt-1 text-xl font-bold">{shortenedUrl}</p>
				</div>
			)}
		</div>
	);
};
