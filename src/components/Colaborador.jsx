import useProyectos from "../hooks/useProyectos";

const Colaborador = ({ colaborador }) => {
  const { name, email } = colaborador;

  const { modalEliminarColaborador, modalHandleEliminarColaborador } = useProyectos();
  return (
    <div className="border-b p-5 flex justify-between items-center">
      <div>
        <p className="font-bold text-gray-800">{name}</p>
        <p className="text-gray-700 text-sm">{email}</p>
      </div>
      <div>
        <button
          type="button"
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
          onClick={() => modalHandleEliminarColaborador(colaborador)}
        >
          Eliminar
        </button>
      </div>
    </div>
  );
};

export default Colaborador;
