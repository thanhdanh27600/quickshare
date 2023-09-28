import { Dropdown } from 'components/atoms/Dropdown';
import { keys } from 'ramda';
import { useBearStore } from 'store';
import { Theme, Themes, backgroundTemplate } from 'types/og';

export const ThemeSelector = () => {
  const Tile = (theme: Theme = 'default') => (
    <div className="h-4 w-4" style={{ background: backgroundTemplate[theme] }}></div>
  );
  const { shortenSlice } = useBearStore();
  const [shortenHistory, setShortenHistory] = shortenSlice((state) => [state.shortenHistory, state.setShortenHistory]);
  const theme = (shortenHistory?.theme || 'default') as Theme;

  return (
    <div className="absolute flex w-[350px] sm:w-[470px]">
      <Dropdown
        buttonClassName="!h-fit !p-0.5"
        ContainerProps={{ className: 'relative' }}
        options={keys(Themes).map((theme) => ({
          label: (
            <div className="flex items-center gap-2">
              <span>{Tile(theme)} </span>
              <span>{Themes[theme]}</span>
            </div>
          ),
          value: theme,
        }))}
        value={theme}
        icon={Tile(theme)}
        handleSelect={(value) => {
          setShortenHistory({ theme: value });
        }}
      />
    </div>
  );
};
