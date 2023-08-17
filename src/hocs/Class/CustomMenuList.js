
import { FixedSizeList as List } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';

export const CustomMenuList = (props) => {
    const { options, children, maxHeight, getValue } = props;
    const [value] = getValue();
    const initialOffset = value ? options.findIndex((option) => option === value) * 35 : 0;

    const itemCount = options.length;
    const itemSize = 35;

    const loadMoreItems = () => { };

    const isItemLoaded = (index) => {
        return index < options.length;
    };

    return (
        <InfiniteLoader
            isItemLoaded={isItemLoaded}
            itemCount={itemCount}
            loadMoreItems={loadMoreItems}
        >
            {({ onItemsRendered, ref }) => (
                <List
                    ref={ref}
                    onItemsRendered={onItemsRendered}
                    width="100%"
                    height={Math.min(maxHeight, children.length * itemSize)}
                    itemCount={itemCount}
                    itemSize={itemSize}
                    initialScrollOffset={initialOffset}
                >
                    {({ index, style }) => (
                        <div style={style}>
                            {children[index] || null}
                        </div>
                    )}
                </List>
            )}
        </InfiniteLoader>
    );
};