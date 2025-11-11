export const ComingSoonImage = ({
    className,
    onLoad,
    onError,
} : {
    className?: string,
    onLoad?: () => void,
    onError?: () => void,
}) => {
    return (
        <img
            src={require("./../img/coming_soon.png")}
            alt="coming_soon"
            className={className}
            onLoad={onLoad}
            onError={onError}
        />
    );
}

export const ComingSoonImageThumbnail = ({
    className,
    onLoad,
    onError,
} : {
    className?: string,
    onLoad?: () => void,
    onError?: () => void,
}) => {
    return (
        <img
            src={require("./../img/coming_soon_sq.png")}
            alt="coming_soon"
            className={className}
            onLoad={onLoad}
            onError={onError}
        />
    );
  }