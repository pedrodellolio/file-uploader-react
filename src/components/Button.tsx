interface Props {
  text: string;
  iconName: string;
  handleFolderState: React.Dispatch<React.SetStateAction<boolean>>;
}

function Button(props: Props) {
  return (
    <button
      onClick={() => props.handleFolderState(true)}
      className="text-sm bg-blue-400 p-2 text-white font-semibold flex flex-row items-center gap-2 hover:bg-blue-500"
    >
      <span className="material-symbols-rounded">{props.iconName}</span>
      {props.text}
    </button>
  );
}

export default Button;
